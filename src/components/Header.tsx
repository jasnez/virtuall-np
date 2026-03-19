"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { PAGE_CONTAINER_X } from "@/lib/page-layout";

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
          "sticky top-0 z-50 h-[72px] transition-[background-color,border-color] duration-200 ease-out border-b",
          isScrolled
            ? "bg-white border-gray-200/90"
            : "bg-white/96 border-gray-200/60",
        )}
      >
        <div
          className={`h-full flex items-center justify-between gap-4 md:gap-6 ${PAGE_CONTAINER_X}`}
        >
          <Link
            href="/"
            className="font-bold text-lg sm:text-xl text-primary hover:text-primary-light transition-colors duration-200 ease-out tracking-tight shrink-0"
          >
            VirtuALL NP
          </Link>

          <nav
            className="hidden md:flex flex-1 items-center justify-center min-w-0 px-4"
            aria-label="Main"
          >
            <div className="flex items-center gap-7 lg:gap-8">
              {navItems.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "text-[15px] font-medium whitespace-nowrap rounded-lg px-2.5 py-2 -my-1",
                      "text-text-light transition-colors duration-200 ease-out",
                      "hover:text-primary hover:bg-gray-50",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                      active && "text-primary font-semibold bg-gray-50/90",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden md:flex shrink-0 items-center border-l border-gray-200/80 pl-7 ml-2 lg:pl-8 lg:ml-3">
            <Button variant="nav" href="/contact" className="shrink-0">
              Get a Quote
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center min-h-12 min-w-12 h-12 w-12 text-primary hover:bg-gray-50 rounded-lg transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 shrink-0"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden="true" focusable="false" className="w-6 h-6" /> : <Menu aria-hidden="true" focusable="false" className="w-6 h-6" />}
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
              className={`flex items-center justify-between h-[72px] shrink-0 border-b border-white/15 ${PAGE_CONTAINER_X}`}
              initial={{ y: -8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Link
                href="/"
                className="text-white font-bold text-lg sm:text-xl tracking-tight py-2 -my-2"
                onClick={() => setMobileOpen(false)}
              >
                VirtuALL NP
              </Link>
              <button
                type="button"
                className="inline-flex items-center justify-center min-h-12 min-w-12 h-12 w-12 text-white rounded-lg hover:bg-white/10 transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X aria-hidden="true" focusable="false" className="w-6 h-6" />
              </button>
            </motion.div>

            <motion.div
              className="flex-1 flex flex-col overflow-y-auto"
              initial={{ y: 8 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
            >
              <nav
                className="flex flex-col w-full max-w-md mx-auto px-5 sm:px-8 pt-8 pb-6 gap-2"
                aria-label="Mobile main"
              >
                {navItems.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(
                        "w-full text-center rounded-xl px-5 py-4 text-[17px] font-medium tracking-tight transition-colors duration-200 ease-out",
                        "text-white/90 hover:text-white hover:bg-white/12 active:bg-white/15",
                        active && "text-white font-semibold bg-white/14",
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="mt-auto px-5 sm:px-8 pb-10 pt-4 w-full max-w-md mx-auto">
                <Button
                  variant="nav"
                  href="/contact"
                  className="w-full justify-center bg-white text-primary border-transparent hover:bg-white/95"
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

