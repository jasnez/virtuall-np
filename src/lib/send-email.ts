import { Resend } from "resend";

// Keep Resend client construction centralized for easy mocking/testing.
// If RESEND_API_KEY is missing in local/dev, email sending will still fail at runtime
// (but won't crash the module import).
const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export type SendEmailParams = {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, from, subject, html }: SendEmailParams) {
  return resend.emails.send({ to, from, subject, html });
}

