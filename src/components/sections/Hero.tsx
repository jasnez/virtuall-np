import homepage from "@/content/homepage.json";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";
import { PAGE_CONTAINER_X } from "@/lib/page-layout";

type HeroProps = {
  disableAnimation?: boolean;
};

export function Hero({ disableAnimation = false }: HeroProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <section
        data-testid="hero"
        className="relative w-full min-h-[min(88vh,56rem)] flex items-center bg-gradient-to-br from-primary to-[#0F2440] overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-5"
        >
          <svg
            className="h-full w-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="geo"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 80L80 0M-20 20L20 -20M60 100L100 60"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                />
                <circle cx="40" cy="40" r="2" fill="white" />
              </pattern>
            </defs>
            <rect width="1200" height="800" fill="url(#geo)" />
          </svg>
        </div>

        <div
          className={`relative z-10 w-full py-24 md:py-28 lg:py-32 ${PAGE_CONTAINER_X}`}
        >
          <div
            data-testid="hero-content"
            className="w-full max-w-[600px] text-white text-left max-lg:mx-auto max-lg:text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-6xl font-bold leading-[1.03] sm:leading-[1.05] lg:leading-[1.06] tracking-[-0.02em] text-balance mb-5">
              {homepage.hero.headline}
            </h1>

            <AnimateIn delay={0.2} disableAnimation={disableAnimation}>
              <p className="text-base sm:text-lg text-white/[0.88] leading-[1.65] mb-8">
                {homepage.hero.subheadline}
              </p>
            </AnimateIn>

            <AnimateIn delay={0.4} disableAnimation={disableAnimation}>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 max-lg:justify-center">
                <Button
                  href="/services"
                  className="bg-white text-[#0F2440] hover:bg-white/95 font-semibold"
                >
                  See Our Services
                </Button>
                <Button
                  href="/contact"
                  className="rounded-xl border-2 border-white/90 bg-transparent text-white hover:bg-white/10 hover:text-white hover:border-white font-medium"
                >
                  Get a Quote
                </Button>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>
    </AnimateIn>
  );
}

