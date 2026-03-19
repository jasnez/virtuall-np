import { CheckCircle2 } from "lucide-react";

import homepage from "@/content/homepage.json";
import processSteps from "@/content/process-steps.json";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function TrustSection() {
  return (
    <AnimateIn delay={0}>
      <SectionWrapper bgColor="white" padding="md">
        <div
          data-testid="trust-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
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
              className="inline-flex items-center gap-2 rounded-full bg-accent/5 px-4 py-2"
            >
              <CheckCircle2
                className="w-5 h-5 text-accent"
                aria-hidden="true"
                focusable="false"
              />
              <strong className="text-sm text-text-main">
                Thoughtful process, source-backed work, and clear expectations on
                every project.
              </strong>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-4 bottom-4 border-l-2 border-accent/20 pointer-events-none" />
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <AnimateIn key={step.step} delay={index * 0.15}>
                  <div
                    data-testid="process-step"
                    className="flex items-start gap-4"
                  >
                    <div
                      data-testid="step-number"
                      className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold"
                    >
                      {step.step}
                    </div>
                    <div className="ml-2">
                      <h3 className="font-medium text-text-main">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-text-light">
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

