import { NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const serviceEnum = z.enum([
  "bespoke-content",
  "research",
  "ai-humanization",
  "llm-optimized",
  "other",
]);

const budgetEnum = z.enum([
  "under-500",
  "500-1000",
  "1000-5000",
  "5000-plus",
]);
const packageEnum = z.enum([
  "pkg_starter",
  "pkg_professional",
  "pkg_premium",
]);

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 10_000;
const MAX_WEBSITE = 500;
const MAX_TURNSTILE_TOKEN = 2048;

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const contactSchema = z.object({
  name: z.string().min(2).max(MAX_NAME),
  email: z.string().email().max(MAX_EMAIL),
  serviceInterest: serviceEnum,
  packageId: packageEnum.optional(),
  budget: budgetEnum.optional(),
  message: z.string().min(10).max(MAX_MESSAGE),
  website: z.string().max(MAX_WEBSITE).optional(),
  turnstileToken: z.string().max(MAX_TURNSTILE_TOKEN).optional(),
});

type ContactPayload = z.infer<typeof contactSchema>;

const packageLabelMap: Record<z.infer<typeof packageEnum>, string> = {
  pkg_starter: "Starter",
  pkg_professional: "Professional",
  pkg_premium: "Premium",
};

function getPackageLabel(packageId?: ContactPayload["packageId"]): string {
  if (!packageId) return "Not selected";
  return packageLabelMap[packageId];
}

// In-memory rate limiting (per-process). For production, use a shared store.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateLimitMap = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const header = req.headers.get("x-forwarded-for") ?? "";
  const [ip] = header.split(",").map((p) => p.trim());
  return ip || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const existing = rateLimitMap.get(ip) ?? [];
  const recent = existing.filter((ts) => ts > windowStart);

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, "").trim();
}

async function verifyTurnstileToken(
  responseToken: string,
  remoteip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", responseToken);
  if (remoteip && remoteip !== "unknown") {
    body.set("remoteip", remoteip);
  }

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.replace(/\s/g, "").toLowerCase().startsWith("application/json")) {
    return NextResponse.json(
      { success: false, error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let json: unknown;

  try {
    json = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  // Basic shape check to read honeypot before full validation
  const body = (json ?? {}) as Partial<ContactPayload>;

  // Honeypot: if website is filled, pretend success but skip email
  if (body.website && body.website.trim().length > 0) {
    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { turnstileToken, ...data } = parsed.data;

  if (process.env.TURNSTILE_SECRET_KEY) {
    const token = turnstileToken?.trim();
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete the security check.",
        },
        { status: 400 },
      );
    }
    const turnstileOk = await verifyTurnstileToken(token, ip);
    if (!turnstileOk) {
      return NextResponse.json(
        {
          success: false,
          error: "Security verification failed. Please try again.",
        },
        { status: 400 },
      );
    }
  }

  const safeName = escapeHtml(stripHtmlTags(data.name));
  const safeEmail = escapeHtml(stripHtmlTags(data.email));
  const safeService = escapeHtml(stripHtmlTags(data.serviceInterest));
  const safePackage = escapeHtml(getPackageLabel(data.packageId));
  const safeBudget = data.budget
    ? escapeHtml(stripHtmlTags(data.budget))
    : "Not specified";
  const safeMessage = escapeHtml(stripHtmlTags(data.message));

  const toEmail = process.env.CONTACT_EMAIL || "sales@virtuall-np.com";
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Email service is not configured. Please try again later or contact us directly.",
      },
      { status: 500 },
    );
  }

  const html = `
    <h2>New website inquiry</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Service interest:</strong> ${safeService}</p>
    <p><strong>Selected package:</strong> ${safePackage}</p>
    <p><strong>Budget:</strong> ${safeBudget}</p>
    <p><strong>Message:</strong></p>
    <p>${safeMessage.replace(/\n/g, "<br />")}</p>
    <hr />
    <p><em>Sent from VirtuALL NP website contact form.</em></p>
  `;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      to: toEmail,
      from: "VirtuALL NP Website <noreply@virtuall-np.com>",
      subject: `New Inquiry from ${safeName}`,
      html,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Error sending contact email", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 },
    );
  }
}

