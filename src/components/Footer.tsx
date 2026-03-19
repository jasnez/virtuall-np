import Link from "next/link";

import siteConfig from "@/content/site-config.json";
import { PAGE_CONTAINER_X } from "@/lib/page-layout";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const { email, phone, address } = siteConfig.contact;
  const addressLine = `${address.street}, ${address.zip} ${address.city}, ${address.country}`;
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  const linkClass =
    "text-white/75 hover:text-white transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-lg";

  return (
    <footer
      data-testid="site-footer"
      className="relative overflow-hidden bg-gradient-to-br from-primary to-[#0F2440] text-white"
    >
      <div
        aria-hidden="true"
        data-testid="footer-pattern"
        className="pointer-events-none absolute inset-0 opacity-5"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="geo-footer"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 80L80 0M-20 20L20 -20M60 100L100 60"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="40" cy="40" r="2" fill="white" />
            </pattern>
          </defs>
          <rect width="1200" height="800" fill="url(#geo-footer)" />
        </svg>
      </div>

      <div className={`relative z-10 ${PAGE_CONTAINER_X} pt-16 pb-8`}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <div className="text-xl font-bold tracking-tight">{siteConfig.siteName}</div>
            <p className="mt-4 text-white/80 leading-[1.62] max-w-sm">
              High-signal content and research that turns complex ideas into clear
              decisions. Built for brands that care about clarity and credibility.
            </p>
          </div>

          <div>
            <h3 className="text-white/85 font-semibold text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${linkClass} inline-block py-1`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white/85 font-semibold text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a className={`${linkClass} inline-block py-1`} href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
              <li>
                <a className={`${linkClass} inline-block py-1`} href={telHref}>
                  {phone}
                </a>
              </li>
              <li className="py-1 text-white/75 leading-[1.6]">{addressLine}</li>
            </ul>
          </div>
        </div>

        <hr className="mt-8 border-white/15" />

        <div className="pt-8 text-center text-sm text-white/60">
          <span>© 2026 VirtuALL NP. All rights reserved.</span>{" "}
          <Link href="/privacy-policy" className={`${linkClass} inline-block mt-px`}>
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}

