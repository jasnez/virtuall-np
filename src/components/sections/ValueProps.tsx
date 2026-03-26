import React from "react";
import { Bot, Circle, MessageCircle, Search, Sparkles } from "lucide-react";

import homepage from "@/content/homepage.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn, StaggerChildren } from "@/components/ui/AnimateIn";
import {
  cardChrome,
  cardHover,
  cardIconCenteredClass,
  cardPadding24,
  cardTitleProminentClass,
} from "@/lib/card-surface";

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> =
  {
    sparkle: Sparkles,
    search: Search,
    "message-circle": MessageCircle,
    bot: Bot,
  };

type ValuePropsProps = {
  disableAnimation?: boolean;
};

export function ValueProps({ disableAnimation = false }: ValuePropsProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <SectionWrapper bgColor="white" padding="lg">
        <div
          data-testid="value-props-intro"
          className="text-center max-w-2xl mx-auto mb-10 md:mb-12"
        >
          <h2 className="text-3xl font-semibold text-text-main tracking-tight leading-[1.18] text-balance">
            Why teams choose VirtuALL NP
          </h2>
        </div>
        <div
          data-testid="value-props-grid"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-7 items-stretch"
        >
          <StaggerChildren
            className="contents"
            stagger={0.1}
            disableAnimation={disableAnimation}
          >
            {homepage.valueProps.map((item) => {
              const Icon =
                iconMap[item.icon as keyof typeof iconMap] ?? Circle;

              return (
                <div
                  key={item.title}
                  data-testid="value-prop-item"
                  className={`flex min-h-0 flex-col items-center text-center h-full ${cardChrome} ${cardPadding24} md:px-7 md:py-7 ${cardHover}`}
                >
                  <Icon
                    data-testid="value-icon"
                    className={cardIconCenteredClass}
                    aria-hidden="true"
                    focusable="false"
                  />
                  <h3 className={cardTitleProminentClass}>{item.title}</h3>
                  <p
                    className="text-sm sm:text-base text-text-light leading-[1.62] flex-1"
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </SectionWrapper>
    </AnimateIn>
  );
}

