"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import processSteps from "@/content/process-steps.json";
import faq from "@/content/faq.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { CtaSection } from "@/components/sections/CtaSection";
import homepage from "@/content/homepage.json";

function FaqAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openIndex !== null) setOpenIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex]);

  return (
    <div className="mt-8 max-w-3xl mx-auto divide-y divide-gray-200">
      {faq.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
          <div key={item.question}>
            <button
              type="button"
              id={buttonId}
              className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-medium text-text-main">{item.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-text-light transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
                focusable="false"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-sm text-text-light leading-relaxed">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function HowWeWorkClient() {
  return (
    <main className="min-h-screen">
      <AnimateIn delay={0}>
        <section className="py-24 md:py-32 bg-gradient-to-br from-primary to-[#0F2440] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">How We Work</h1>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              A clear, source-backed process from discovery to delivery—so you
              always know what&apos;s happening next.
            </p>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0}>
        <SectionWrapper bgColor="white" padding="lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-text-main">
              Our Process
            </h2>
            <p className="mt-3 text-text-light">
              Five structured steps that keep projects moving while leaving room
              for thoughtful collaboration.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {processSteps.map((step, index) => (
              <AnimateIn
                key={step.title}
                delay={index * 0.15}
                className="flex flex-col md:flex-row gap-6"
              >
                <div className="relative">
                  <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-accent/20" />
                  <div
                    data-testid="timeline-step"
                    className="relative flex flex-col items-center"
                  >
                    <div
                      data-testid="timeline-number"
                      className="w-12 h-12 rounded-full bg-accent-dark text-white flex items-center justify-center font-bold text-lg z-10"
                    >
                      {step.step}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-text-main">{step.title}</h3>
                  <p className="mt-2 text-sm text-text-light">
                    {step.description}
                  </p>
                </div>
              </AnimateIn>
            ))}
          </div>
        </SectionWrapper>
      </AnimateIn>

      <AnimateIn delay={0}>
        <SectionWrapper bgColor="alt" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-text-main text-center">
              Frequently Asked Questions
            </h2>
            <FaqAccordion />
          </div>
        </SectionWrapper>
      </AnimateIn>

      <CtaSection
        title={homepage.cta.headline}
        description={homepage.cta.description}
        ctaLabel={homepage.cta.ctaText}
        ctaHref="/contact"
      />
    </main>
  );
}

