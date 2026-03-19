import React from "react";
import { Bot, PenLine, Search, Sparkles } from "lucide-react";

import services from "@/content/services.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn, StaggerChildren } from "@/components/ui/AnimateIn";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    "pen-line": PenLine,
    search: Search,
    sparkles: Sparkles,
    bot: Bot,
  };

type ServicesPreviewProps = {
  disableAnimation?: boolean;
};

export function ServicesPreview({
  disableAnimation = false,
}: ServicesPreviewProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <SectionWrapper bgColor="alt" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-text-main tracking-tight leading-[1.18] text-balance">
            What We Do
          </h2>
          <p className="mt-4 text-text-light leading-[1.62]">
            A quick look at how we help teams turn complex, high-stakes work into
            clear, credible content and research.
          </p>
        </div>

        <div
          data-testid="services-grid"
          className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch"
        >
          <StaggerChildren
            className="contents"
            stagger={0.1}
            disableAnimation={disableAnimation}
          >
            {services.map((svc) => {
              const Icon = iconMap[svc.icon as keyof typeof iconMap] ?? Sparkles;

              return (
                <a
                  key={svc.id}
                  data-testid="service-card"
                  href={`/services#${svc.slug}`}
                  className="group rounded-xl bg-white border border-gray-200/80 hover:border-gray-300/80 hover:bg-gray-50/40 transition-colors duration-200 ease-out p-6 sm:p-8 flex flex-col h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <Icon
                    className="w-10 h-10 text-accent mb-4 shrink-0"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <h3 className="text-lg font-semibold text-text-main tracking-tight leading-snug">
                    {svc.title}
                  </h3>
                  <p className="mt-3 text-sm text-text-light leading-[1.62]">
                    {svc.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center text-accent group-hover:text-accent-dark font-medium text-sm transition-colors duration-200 ease-out">
                    Learn More →
                  </span>
                </a>
              );
            })}
          </StaggerChildren>
        </div>
      </SectionWrapper>
    </AnimateIn>
  );
}

