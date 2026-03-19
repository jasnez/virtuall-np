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
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-text-main tracking-tight leading-[1.18] text-balance mb-4">
                Why Work With Us
              </h2>
              <div className="space-y-4 text-text-light leading-[1.62]">
                {homepage.trust.narrative.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
            <div
              data-testid="guarantee-badge"
              className="inline-flex items-center gap-3 rounded-full border border-accent/15 bg-accent/10 px-5 py-3"
            >
              <CheckCircle2
                className="w-5 h-5 text-accent shrink-0"
                aria-hidden="true"
                focusable="false"
              />
              <strong className="text-sm text-text-main leading-[1.45]">
                Thoughtful process, source-backed work, and clear expectations on
                every project.
              </strong>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute left-[1.28rem] top-6 bottom-6 w-px bg-accent/20 pointer-events-none"
              aria-hidden
            />
            <div className="space-y-6 sm:space-y-7">
              {processSteps.map((step, index) => (
                <AnimateIn
                  key={step.step}
                  delay={index * 0.15}
                  disableAnimation={disableAnimation}
                >
                  <div
                    data-testid="process-step"
                    className="relative flex items-start gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-6"
                  >
                    <div
                      data-testid="step-number"
                      className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent-dark text-sm font-bold text-white"
                    >
                      {step.step}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mt-0.5 text-lg font-semibold text-text-main tracking-tight sm:text-[1.125rem]">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 text-sm text-text-light leading-[1.62] sm:mt-2">
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

