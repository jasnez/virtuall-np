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
      <SectionWrapper
        bgColor="navy"
        padding="lg"
        className="border-t border-white/10"
      >
        <AnimateIn
          className="mx-auto max-w-[38rem] text-center text-white"
          disableAnimation={disableAnimation}
        >
          <h2 className="mx-auto mb-4 max-w-[35rem] text-3xl font-semibold tracking-tight leading-[1.18] text-balance">
            {title}
          </h2>
          <p className="mx-auto mb-6 max-w-[32.5rem] text-white/90 leading-[1.62]">
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

