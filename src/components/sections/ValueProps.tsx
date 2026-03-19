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
      <SectionWrapper bgColor="white" padding="md">
        <h2 className="sr-only">Why teams choose VirtuALL NP</h2>
        <div
          data-testid="value-props-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
                  className="flex flex-col items-center text-center p-4"
                >
                  <Icon
                    data-testid="value-icon"
                    className="w-10 h-10 text-accent mb-3"
                  aria-hidden="true"
                  focusable="false"
                  />
                  <h3 className="font-semibold text-text-main">{item.title}</h3>
                  <p className="text-sm text-text-light">{item.description}</p>
                </div>
              );
            })}
          </StaggerChildren>
        </div>
      </SectionWrapper>
    </AnimateIn>
  );
}

