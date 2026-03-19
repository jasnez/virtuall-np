import type { Metadata } from "next";
import siteConfig from "@/content/site-config.json";

const ogImageUrl = "/opengraph-image";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read VirtuALL NP's Privacy Policy to understand what data we collect, how analytics and cookies are used, and how to exercise your privacy rights.",
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "Read VirtuALL NP's Privacy Policy to understand what data we collect, how analytics and cookies are used, and how to exercise your privacy rights.",
    url: `${siteConfig.url}/privacy-policy`,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: siteConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description:
      "Read VirtuALL NP's Privacy Policy to understand what data we collect, how analytics and cookies are used, and how to exercise your privacy rights.",
    images: [ogImageUrl],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 md:px-6 py-20 prose prose-slate">
        <h1>Privacy Policy</h1>

        <h2>Introduction</h2>
        <p>
          This Privacy Policy explains how VirtuALL NP (“we”, “us”, “our”) collects
          and uses personal data when you visit our website or contact us. VirtuALL NP
          is the data controller for the processing described here.
        </p>
        <p>
          <strong>Data controller:</strong> VirtuALL NP<br />
          <strong>Address:</strong> {siteConfig.contact.address.street},{" "}
          {siteConfig.contact.address.zip} {siteConfig.contact.address.city},{" "}
          {siteConfig.contact.address.country}
          <br />
          <strong>Email:</strong>{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
        </p>

        <h2>Data We Collect</h2>
        <p>We collect the following categories of data:</p>
        <ul>
          <li>
            <strong>Contact form data:</strong> name, email, service interest, and
            message content.
          </li>
          <li>
            <strong>Analytics data:</strong> cookies, page views, and basic usage
            signals (e.g., interactions and approximate device/browser information)
            collected to understand how the site is used.
          </li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul>
          <li>
            <strong>Respond to your inquiry:</strong> to reply to messages and provide
            requested information about our services.
          </li>
          <li>
            <strong>Improve our service:</strong> to analyze site traffic and improve
            performance, content quality, and user experience.
          </li>
        </ul>

        <h2>Cookies</h2>
        <p>
          Cookies are small text files stored on your device. We use cookies to
          remember your preferences and, with your consent, to measure website
          usage.
        </p>
        <p>
          <strong>Cookies we use:</strong> Google Analytics 4 (GA4) analytics cookies
          to understand page views and usage patterns. GA4 is only loaded after you
          consent to analytics cookies.
        </p>
        <p>
          <strong>How to control cookies:</strong> you can withdraw consent at any
          time by clearing cookies in your browser, adjusting browser settings to
          block cookies, or using privacy controls offered by your browser/device.
        </p>

        <h2>Third-Party Services</h2>
        <p>
          We use trusted vendors to run this website and communicate with you:
        </p>
        <ul>
          <li>
            <strong>Google Analytics</strong> for website analytics (loaded only after
            consent).
          </li>
          <li>
            <strong>Vercel</strong> for website hosting and delivery.
          </li>
          <li>
            <strong>Resend</strong> for sending emails in response to contact requests.
          </li>
        </ul>

        <h2>Data Retention</h2>
        <ul>
          <li>
            <strong>Contact form submissions:</strong> we retain inquiry data for up
            to <strong>12 months</strong> to manage conversations and follow-ups.
          </li>
          <li>
            <strong>Analytics data:</strong> retained for <strong>26 months</strong>,
            which aligns with common Google Analytics retention defaults.
          </li>
        </ul>

        <h2>Your Rights</h2>
        <p>
          If the GDPR applies to you, you may have rights including access, correction,
          deletion, and objection to certain processing. You may also have the right to
          restrict processing and to data portability in certain circumstances.
        </p>
        <p>
          To exercise your rights, contact us and we will respond in accordance with
          applicable law.
        </p>

        <h2>Contact Us</h2>
        <p>
          For privacy questions or requests, email{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>
            {siteConfig.contact.email}
          </a>
          .
        </p>
      </div>
    </main>
  );
}

