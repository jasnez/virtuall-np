jest.mock("next/server", () => {
  return {
    __esModule: true,
    NextResponse: {
      json: (body: any, init?: ResponseInit) => ({
        status: init?.status ?? 200,
        json: async () => body,
      }),
    },
  };
});

jest.mock("resend", () => {
  const sendMock = jest.fn().mockResolvedValue({});
  return {
    __esModule: true,
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: sendMock,
      },
    })),
    __sendMock: sendMock,
  };
});

// Import after mocks so route uses the mocked modules
// eslint-disable-next-line import/first
import { POST } from "./route";

describe("POST /api/contact", () => {
  const originalEnv = process.env;
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = originalFetch;
    process.env = {
      ...originalEnv,
      CONTACT_EMAIL: "sales@virtuall-np.com",
      RESEND_API_KEY: "test_api_key",
    };
    delete process.env.TURNSTILE_SECRET_KEY;
    const { __sendMock } = jest.requireMock("resend");
    __sendMock.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function createRequest(
    body: unknown,
    ip = "127.0.0.1",
    contentType = "application/json",
  ) {
    const headers = new Map<string, string>();
    headers.set("content-type", contentType);
    headers.set("x-forwarded-for", ip);

    const req = {
      headers: {
        get: (key: string) => headers.get(key.toLowerCase()) ?? null,
      },
      json: async () => body,
    };

    return req as any;
  }

  it("returns 200 and sends email when payload is valid", async () => {
    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      packageId: "pkg_professional",
      budget: "500-1000",
      message: "This is a valid message about a project.",
      website: "",
    };

    const res = await POST(createRequest(body));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).toHaveBeenCalled();
    const payload = __sendMock.mock.calls[0][0];
    expect(payload.html).toContain("Selected package:");
    expect(payload.html).toContain("Professional");
  });

  it("honours honeypot field and does not send email", async () => {
    const body = {
      name: "Bot User",
      email: "bot@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "Spam message",
      website: "http://spam.example.com",
    };

    const res = await POST(createRequest(body));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).not.toHaveBeenCalled();
  });

  it("returns 415 when Content-Type is not application/json", async () => {
    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      message: "Valid message here.",
      website: "",
    };

    const res = await POST(createRequest(body, "127.0.0.1", "text/plain"));
    expect(res.status).toBe(415);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("application/json");
  });

  it("returns 400 when validation fails", async () => {
    const body = {
      name: "J",
      email: "invalid-email",
      serviceInterest: "invalid-service",
      message: "short",
      website: "",
    };

    const res = await POST(createRequest(body));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toBeDefined();
  });

  it("returns 400 when message exceeds max length", async () => {
    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      message: "a".repeat(10_001),
      website: "",
    };

    const res = await POST(createRequest(body, "127.0.0.2"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("enforces rate limiting per IP", async () => {
    const validBody = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "This is a valid message about a project.",
      website: "",
    };

    const ip = "203.0.113.10";

    // 5 allowed requests
    for (let i = 0; i < 5; i += 1) {
      const res = await POST(createRequest(validBody, ip));
      expect(res.status).toBe(200);
    }

    // 6th should be rate-limited
    const res = await POST(createRequest(validBody, ip));
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("strips html tags from user fields before sending email", async () => {
    const body = {
      name: "<b>John Doe</b>",
      email: "john@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "<script>alert('xss')</script>Hello world message",
      website: "",
    };

    const res = await POST(createRequest(body, "203.0.113.77"));
    expect(res.status).toBe(200);

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).toHaveBeenCalledTimes(1);
    const payload = __sendMock.mock.calls[0][0];
    expect(payload.html).not.toContain("<script>");
    expect(payload.html).toContain("Hello world message");
    expect(payload.html).not.toContain("<b>John Doe</b>");
    expect(payload.html).toContain("John Doe");
  });

  it("sanitizes XSS payload in message (img onerror)", async () => {
    const body = {
      name: "Test User",
      email: "test@example.com",
      serviceInterest: "research",
      message: '<img src=x onerror=alert(1)>',
      website: "",
    };

    const res = await POST(createRequest(body, "203.0.113.99"));
    expect(res.status).toBe(200);

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).toHaveBeenCalledTimes(1);
    const payload = __sendMock.mock.calls[0][0];
    expect(payload.html).not.toMatch(/onerror\s*=/i);
    expect(payload.html).not.toContain("<img");
    expect(payload.subject).not.toMatch(/onerror|alert/i);
  });

  it("returns 400 when Turnstile secret is set but token is missing", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test_turnstile_secret";

    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "This is a valid message about a project.",
      website: "",
    };

    const res = await POST(createRequest(body, "203.0.113.50"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toContain("security check");

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when Turnstile verification fails", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test_turnstile_secret";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: false, "error-codes": ["invalid-input-response"] }),
    }) as jest.Mock;

    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "This is a valid message about a project.",
      website: "",
      turnstileToken: "bad-token",
    };

    const res = await POST(createRequest(body, "203.0.113.51"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/verification failed/i);

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).not.toHaveBeenCalled();
  });

  it("verifies Turnstile and sends email when secret and token are valid", async () => {
    process.env.TURNSTILE_SECRET_KEY = "test_turnstile_secret";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    }) as jest.Mock;

    const body = {
      name: "John Doe",
      email: "john@example.com",
      serviceInterest: "research",
      budget: "500-1000",
      message: "This is a valid message about a project.",
      website: "",
      turnstileToken: "valid-mock-token",
    };

    const res = await POST(createRequest(body, "203.0.113.52"));
    expect(res.status).toBe(200);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST" }),
    );

    const { __sendMock } = jest.requireMock("resend");
    expect(__sendMock).toHaveBeenCalled();
  });
});

