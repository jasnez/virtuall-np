// This file exists to enforce TypeScript typechecking of "@/types" exports.
// It is not imported at runtime.
import type {
  AddOn,
  Address,
  ContactFormData,
  ContactInfo,
  FaqItem,
  Package,
  PageMeta,
  PriceRange,
  ProcessStep,
  ProjectPricing,
  Retainer,
  Service,
  SiteConfig,
} from "@/types";

export const __typecheck: {
  siteConfig: SiteConfig;
  contact: ContactInfo;
  address: Address;
  service: Service;
  pkg: Package;
  priceRange: PriceRange;
  addOn: AddOn;
  retainer: Retainer;
  projectPricing: ProjectPricing;
  processStep: ProcessStep;
  faqItem: FaqItem;
  contactFormData: ContactFormData;
  pageMeta: PageMeta;
} = null as unknown as {
  siteConfig: SiteConfig;
  contact: ContactInfo;
  address: Address;
  service: Service;
  pkg: Package;
  priceRange: PriceRange;
  addOn: AddOn;
  retainer: Retainer;
  projectPricing: ProjectPricing;
  processStep: ProcessStep;
  faqItem: FaqItem;
  contactFormData: ContactFormData;
  pageMeta: PageMeta;
};

