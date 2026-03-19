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
          "sticky top-0 z-50 h-[76px] backdrop-blur-md transition-all duration-200 border-b",
          isScrolled
            ? "bg-white border-gray-100 shadow-[0_1px_3px_rgba(27,58,92,0.06)]"
            : "bg-white/98 border-primary/[0.08]",
        )}
      >
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          <Link
            href="/"
            className="font-bold text-xl text-primary hover:text-primary-light transition-colors duration-200 tracking-tight shrink-0 py-2 -my-2"
          >
            VirtuALL NP
          </Link>

          <nav className="hidden md:flex items-center flex-1 justify-end min-w-0">
            <div className="flex items-center gap-7">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "text-text-light hover:text-primary font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md py-2 px-0.5 text-[15px] whitespace-nowrap",
                      active && "text-primary font-semibold",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="hidden md:block w-px h-5 bg-gray-200 mx-6 shrink-0" aria-hidden />
            <Button variant="nav" href="/contact" className="shrink-0">
              Get a Quote
            </Button>
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-11 h-11 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg shrink-0"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden="true" focusable="false" className="w-5 h-5" /> : <Menu aria-hidden="true" focusable="false" className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            data-testid="mobile-overlay"
            className="fixed inset-0 bg-primary z-40 md:hidden flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <motion.div
              className="flex items-center justify-between h-[76px] px-4 sm:px-6 border-b border-white/10 shrink-0"
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link
                href="/"
                className="text-white font-bold text-xl tracking-tight"
                onClick={() => setMobileOpen(false)}
              >
                VirtuALL NP
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center w-11 h-11 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-lg"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X aria-hidden="true" focusable="false" className="w-5 h-5" />
              </button>
            </motion.div>

            <motion.div
              className="flex-1 flex flex-col items-center justify-center px-6 pb-8 pt-4"
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
            >
              <nav className="flex flex-col items-center gap-1 w-full max-w-xs">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-full py-4 text-center text-white text-xl font-medium tracking-tight hover:text-white/90 active:text-white/80 transition-colors border-b border-white/10 last:border-0"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-10 w-full max-w-xs">
                <Button
                  variant="nav"
                  href="/contact"
                  className="w-full justify-center bg-white text-primary hover:bg-white/95 py-3.5 text-base font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Get a Quote
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

