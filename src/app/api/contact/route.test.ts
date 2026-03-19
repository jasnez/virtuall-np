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

  beforeEach(() => {
    process.env = { ...originalEnv, CONTACT_EMAIL: "office@virtuall-np.com" };
    const { __sendMock } = jest.requireMock("resend");
    __sendMock.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function createRequest(body: unknown, ip = "127.0.0.1") {
    const headers = new Map<string, string>();
    headers.set("content-type", "application/json");
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
});

