import type { EmailParams } from "resend";

describe("send-email helper", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv, RESEND_API_KEY: "re_test_123" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("initializes Resend with RESEND_API_KEY", async () => {
    jest.resetModules();

    const sendMock = jest.fn().mockResolvedValue({});

    jest.doMock("resend", () => {
      return {
        __esModule: true,
        Resend: jest.fn().mockImplementation((_key: string) => ({
          emails: {
            send: sendMock,
          },
        })),
      };
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("./send-email") as {
      sendEmail: (params: EmailParams & { html: string }) => Promise<unknown>;
    };

    await mod.sendEmail({
      to: "someone@example.com",
      from: "from@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    } as any);

    const { Resend } = require("resend");
    expect(Resend).toHaveBeenCalledWith("re_test_123");
    expect(sendMock).toHaveBeenCalled();
  });
});

