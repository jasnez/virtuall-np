import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";

type CtaSectionProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  disableAnimation?: boolean;
};

export function CtaSection({
  title,
  description,
  ctaLabel = "Start a Project",
  ctaHref = "/contact",
  disableAnimation = false,
}: CtaSectionProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <SectionWrapper bgColor="navy" padding="lg">
        <AnimateIn className="text-center text-white" disableAnimation={disableAnimation}>
          <h2 className="text-3xl font-semibold tracking-tight max-w-3xl mx-auto">
            {title}
          </h2>
          <p className="text-white/85 mt-6 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="mt-12">
            <Button
              href={ctaHref}
              className="font-semibold px-8 py-3.5 text-base min-h-[48px]"
            >
              {ctaLabel}
            </Button>
          </div>
        </AnimateIn>
      </SectionWrapper>
    </AnimateIn>
  );
}

