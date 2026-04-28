"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { AudioToggle } from "./audio-toggle";
import { Logo } from "./logo";

export function Nav() {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "/#pillars", label: t("nav.pillars") },
    { href: "/#flow", label: t("nav.flow") },
    { href: "/#future", label: t("nav.future") },
    { href: "/#opensource", label: t("nav.opensource") },
    { href: "/docs", label: t("nav.docs") },
  ];

  return (
    <>
      {/* Floating pill wrapper — pointer-events-none so page scrolls freely under it */}
      <div className="fixed top-4 inset-x-0 z-50 px-4 pointer-events-none">
        <header
          className={`mx-auto max-w-5xl pointer-events-auto rounded-2xl border border-white/[0.06] backdrop-blur-md transition-all duration-300 ${
            scrolled
              ? "bg-[rgba(13,13,20,0.88)] shadow-[0_4px_32px_-8px_rgba(0,0,0,0.5)]"
              : "bg-[rgba(13,13,20,0.50)]"
          }`}
        >
          <div className="h-[52px] px-5 flex items-center justify-between">
            <Link
              href="/"
              className="hover:opacity-80 transition-opacity flex-shrink-0"
              aria-label="SkillBrain — home"
            >
              <Logo />
            </Link>

            {/* Desktop links */}
            <nav
              aria-label="Primary"
              className="hidden md:flex items-center gap-8 text-sm text-muted"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <AudioToggle />
              <LanguageSwitcher />

              {/* CTA — filled accent */}
              <Link
                href="/#call"
                className="hidden md:inline-flex items-center text-sm font-medium px-4 py-1.5 rounded-full bg-accent/90 text-white hover:bg-accent transition-colors"
              >
                {t("nav.call")}
              </Link>

              {/* Hamburger — mobile only */}
              <button
                type="button"
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <motion.span
                  className="block h-[1.5px] w-5 bg-foreground rounded-full"
                  animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[1.5px] w-5 bg-foreground rounded-full"
                  animate={open ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="block h-[1.5px] w-5 bg-foreground rounded-full"
                  animate={open ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Mobile menu — drops from just below the pill */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[72px] inset-x-4 z-40 md:hidden rounded-2xl border border-white/[0.06] bg-[rgba(13,13,20,0.95)] backdrop-blur-md overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-6 gap-1" aria-label="Mobile">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className="block py-3 text-lg text-muted hover:text-foreground transition-colors border-b border-white/[0.06] last:border-0"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: links.length * 0.05, duration: 0.2 }}
                className="pt-4"
              >
                <Link
                  href="/#call"
                  className="inline-flex w-full justify-center text-sm font-medium px-4 py-3 rounded-full bg-accent/90 text-white hover:bg-accent transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {t("nav.call")}
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
