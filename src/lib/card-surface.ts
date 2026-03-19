/**
 * Unified cards: 16px radius, 20px / 24px padding, subtle border.
 * Hover = border emphasis + light background (no shadow, no lift).
 */
export const cardChrome = "rounded-2xl border border-gray-200/80 bg-white";

export const cardPadding = {
  sm: "p-4 md:p-5",
  md: "p-5 md:p-6",
  lg: "p-5 md:p-6",
} as const;

/** Uniform 24px padding (trust / value-prop grids) */
export const cardPadding24 = "p-6";

export const cardHover =
  "transition-[border-color,background-color] duration-200 ease-out hover:border-gray-400/50 hover:bg-gray-50/55";

/** Icon (above title): 16px gap below */
export const cardIconClass = "h-10 w-10 shrink-0 text-accent mb-4";

/** Card title: stronger than body, 12px below before description */
export const cardTitleClass =
  "font-semibold text-text-main text-lg tracking-tight leading-snug mb-3";

/** In-card title with extra emphasis (trust / value props) */
export const cardTitleProminentClass =
  "font-bold text-text-main text-lg sm:text-xl tracking-tight leading-snug text-balance mb-3";

/** Centered icon row for trust / value-prop cards */
export const cardIconCenteredClass = `${cardIconClass} mx-auto`;

/** Card body / description */
export const cardDescriptionClass = "text-sm text-text-light leading-[1.62]";
