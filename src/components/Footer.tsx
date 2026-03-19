import Link from "next/link";

import siteConfig from "@/content/site-config.json";

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

  return (
    <footer data-testid="site-footer" className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div>
            <div className="text-xl font-bold">{siteConfig.siteName}</div>
            <p className="mt-3 text-white/70">
              High-signal content and research that turns complex ideas into clear
              decisions. Built for brands that care about clarity and credibility.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a className="text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
              <li>
                <a className="text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded" href={telHref}>
                  {phone}
                </a>
              </li>
              <li className="text-white/70">{addressLine}</li>
            </ul>
          </div>
        </div>

        <hr className="border-white/20" />

        <div className="text-center text-white/50 text-sm py-6">
          <span>© 2026 VirtuALL NP. All rights reserved.</span>{" "}
          <Link href="/privacy-policy" className="hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}

