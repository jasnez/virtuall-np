"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How We Work", href: "/how-we-work" },
  { label: "Packages", href: "/packages" },
  { label: "Contact", href: "/contact" },
];

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname() ?? "/";
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    document.body.style.overflow = "";
    return;
  }, [mobileOpen]);

  React.useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header
        data-testid="site-header"
        className={cx(
          "sticky top-0 z-50 h-[72px] backdrop-blur-md transition-all duration-200",
          isScrolled ? "bg-white shadow-[0_1px_3px_rgba(27,58,92,0.06)]" : "bg-white/95",
        )}
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl text-primary hover:text-primary-light transition-colors">
            VirtuALL NP
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "text-text-light hover:text-primary font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md py-1",
                    active && "text-primary font-semibold",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}

            <Button variant="nav" href="/contact">
              Get a Quote
            </Button>
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2.5 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden="true" focusable="false" /> : <Menu aria-hidden="true" focusable="false" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            data-testid="mobile-overlay"
            className="fixed inset-0 bg-primary z-40 md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="h-[72px] flex items-center justify-end px-4 sm:px-6 lg:px-8">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X aria-hidden="true" focusable="false" />
              </button>
            </div>

            <div className="h-[calc(100vh-72px)] flex flex-col items-center justify-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white text-2xl font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <Button
                variant="nav"
                href="/contact"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setMobileOpen(false)}
              >
                Get a Quote
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

