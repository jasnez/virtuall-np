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

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  serviceInterest: serviceEnum,
  budget: budgetEnum.optional(),
  message: z.string().min(10),
  website: z.string().optional(),
});

type ContactPayload = z.infer<typeof contactSchema>;

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

export async function POST(req: Request) {
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

  const data = parsed.data;

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeService = escapeHtml(data.serviceInterest);
  const safeBudget = data.budget ? escapeHtml(data.budget) : "Not specified";
  const safeMessage = escapeHtml(data.message);

  const toEmail = process.env.CONTACT_EMAIL || "office@virtuall-np.com";
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
      subject: `New Inquiry from ${data.name}`,
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

