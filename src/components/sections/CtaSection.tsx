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
          <h2 className="text-3xl font-semibold tracking-tight leading-[1.18] max-w-3xl mx-auto text-balance mb-4">
            {title}
          </h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto leading-[1.62]">
            {description}
          </p>
          <div>
            <Button href={ctaHref}>
              {ctaLabel}
            </Button>
          </div>
        </AnimateIn>
      </SectionWrapper>
    </AnimateIn>
  );
}

