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
      <SectionWrapper bgColor="navy" padding="md">
        <AnimateIn className="text-center text-white" disableAnimation={disableAnimation}>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">{description}</p>
          <Button href={ctaHref} className="mt-8">
            {ctaLabel}
          </Button>
        </AnimateIn>
      </SectionWrapper>
    </AnimateIn>
  );
}

