import { CheckCircle2 } from "lucide-react";

import homepage from "@/content/homepage.json";
import processSteps from "@/content/process-steps.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn } from "@/components/ui/AnimateIn";

type TrustSectionProps = {
  disableAnimation?: boolean;
};

export function TrustSection({ disableAnimation = false }: TrustSectionProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <SectionWrapper bgColor="white" padding="lg">
        <div
          data-testid="trust-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center"
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-text-main">
              Why Work With Us
            </h2>
            <div className="space-y-4 text-text-light leading-relaxed">
              {homepage.trust.narrative.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div
              data-testid="guarantee-badge"
              className="inline-flex items-center gap-3 rounded-full bg-accent/10 px-5 py-3"
            >
              <CheckCircle2
                className="w-5 h-5 text-accent shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <strong className="text-sm text-text-main leading-snug">
                Thoughtful process, source-backed work, and clear expectations on
                every project.
              </strong>
            </div>
          </div>

          <div className="relative pl-1">
            <div className="absolute left-4 top-5 bottom-5 w-px bg-accent/20 pointer-events-none" />
            <div className="space-y-8">
              {processSteps.map((step, index) => (
                <AnimateIn
                  key={step.step}
                  delay={index * 0.15}
                  disableAnimation={disableAnimation}
                >
                  <div
                    data-testid="process-step"
                    className="flex items-start gap-4"
                  >
                    <div
                      data-testid="step-number"
                      className="w-8 h-8 rounded-full bg-accent-dark text-white flex items-center justify-center text-sm font-bold shrink-0"
                    >
                      {step.step}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-text-main">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-light leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </AnimateIn>
  );
}

