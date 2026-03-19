import React from "react";
import { Bot, Circle, MessageCircle, Search, Sparkles } from "lucide-react";

import homepage from "@/content/homepage.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn, StaggerChildren } from "@/components/ui/AnimateIn";

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
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl font-semibold text-text-main tracking-tight leading-[1.18] text-balance">
            Why teams choose VirtuALL NP
          </h2>
        </div>
        <div
          data-testid="value-props-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-stretch"
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
                  className="flex flex-col items-center text-center p-6 sm:p-8 rounded-xl border border-gray-200/80 bg-white hover:border-gray-300/80 hover:bg-gray-50/40 transition-colors duration-200 ease-out h-full"
                >
                  <Icon
                    data-testid="value-icon"
                    className="w-10 h-10 text-accent mb-4 shrink-0"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <h3 className="text-lg font-semibold text-text-main tracking-tight leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-text-light leading-[1.62]">{item.description}</p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </SectionWrapper>
    </AnimateIn>
  );
}

