import React from "react";
import { Bot, PenLine, Search, Sparkles } from "lucide-react";

import services from "@/content/services.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn, StaggerChildren } from "@/components/ui/AnimateIn";
import {
  cardChrome,
  cardDescriptionClass,
  cardHover,
  cardIconClass,
  cardPadding24,
  cardTitleClass,
} from "@/lib/card-surface";

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
          <h2 className="text-3xl font-semibold text-text-main tracking-tight leading-[1.18] text-balance mb-8">
            What We Do
          </h2>
          <p className="text-text-light leading-[1.62]">
            We help brands communicate clearly through thoughtful writing,
            research, and editorial support. Every service is handled by humans
            from start to finish.
          </p>
        </div>

        <div
          data-testid="services-grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 items-stretch"
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
                  className={`group flex h-full cursor-pointer flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${cardChrome} ${cardPadding24} ${cardHover}`}
                >
                  <Icon
                    className={cardIconClass}
                    aria-hidden="true"
                    focusable="false"
                  />
                  <h3 className={cardTitleClass}>{svc.title}</h3>
                  <p className={`${cardDescriptionClass} flex-1`}>
                    {svc.shortDescription}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-accent transition-[color,transform] duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent-dark">
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

