import homepage from "@/content/homepage.json";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Button } from "@/components/ui/Button";

type HeroProps = {
  disableAnimation?: boolean;
};

export function Hero({ disableAnimation = false }: HeroProps) {
  return (
    <AnimateIn delay={0} disableAnimation={disableAnimation}>
      <section
        data-testid="hero"
        className="relative w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary to-[#0F2440] overflow-hidden"
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

        <div className="relative px-4 sm:px-6 py-20 md:py-24 w-full">
          <div className="mx-auto max-w-2xl text-center text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] sm:leading-[1.1] tracking-tight text-balance">
              {homepage.hero.headline}
            </h1>

            <AnimateIn delay={0.2} disableAnimation={disableAnimation}>
              <p className="text-lg md:text-xl text-white/[0.92] mt-8 max-w-xl mx-auto leading-[1.62]">
                {homepage.hero.subheadline}
              </p>
            </AnimateIn>

            <AnimateIn delay={0.4} disableAnimation={disableAnimation}>
              <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mt-12">
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

