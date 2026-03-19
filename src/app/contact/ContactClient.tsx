"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Phone } from "lucide-react";
import siteConfig from "@/content/site-config.json";

const serviceEnum = z.enum([
  "bespoke-content",
  "research",
  "ai-humanization",
  "llm-optimized",
  "other",
]);

const budgetEnum = z.enum([
  "under-500",
  "500-1000",
  "1000-5000",
  "5000-plus",
]);

const MAX_NAME = 200;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 10_000;
const MAX_WEBSITE = 500;

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name")
    .max(MAX_NAME, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email")
    .max(MAX_EMAIL, "Email is too long"),
  serviceInterest: serviceEnum,
  budget: budgetEnum.optional(),
  message: z
    .string()
    .min(10, "Please tell us a bit more about your project")
    .max(MAX_MESSAGE, "Message is too long"),
  website: z.string().max(MAX_WEBSITE).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const validPackageParams = new Set([
  "starter",
  "professional",
  "premium",
  "pkg_starter",
  "pkg_professional",
  "pkg_premium",
]);

export default function ContactClient() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const packageParam = searchParams.get("package");
  const hasValidPackageParam = packageParam
    ? validPackageParams.has(packageParam)
    : false;

  const inferredService: ContactFormValues["serviceInterest"] =
    (serviceParam && serviceEnum.safeParse(serviceParam).success
      ? (serviceParam as ContactFormValues["serviceInterest"])
      : null) ?? (hasValidPackageParam ? "bespoke-content" : "other");

  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      serviceInterest: inferredService,
      budget: undefined,
      message: "",
      website: "",
    },
  });

  const onSubmit: (data: ContactFormValues) => Promise<void> = async (data) => {
    // honeypot check
    if (data.website && data.website.trim().length > 0) {
      setStatus("success");
      setErrorMessage(null);
      reset({ ...data, website: "" });
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        let message = "Something went wrong. Please try again.";
        try {
          const json: unknown = await res.json();
          if (
            typeof json === "object" &&
            json !== null &&
            "error" in json &&
            typeof (json as { error?: unknown }).error === "string"
          ) {
            message = (json as { error: string }).error;
          }
        } catch {
          // ignore invalid json
        }
        setStatus("error");
        setErrorMessage(message);
        return;
      }

      setStatus("success");
      reset({
        name: "",
        email: "",
        serviceInterest: inferredService,
        budget: undefined,
        message: "",
        website: "",
      });
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen">
      <AnimateIn delay={0}>
        <section className="py-24 md:py-32 bg-gradient-to-br from-primary to-[#0F2440] text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">Contact</h1>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Tell us what you&apos;re building, where you need support, and any
              timelines we should know about.
            </p>
          </div>
        </section>
      </AnimateIn>

      <AnimateIn delay={0}>
        <SectionWrapper bgColor="white" padding="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
            <h2 className="text-3xl font-semibold text-text-main">Get in Touch</h2>
            <p className="mt-4 text-text-light">
              Share a bit about your product, goals, and constraints. We&apos;ll
              reply within 24 hours with next steps—or a few clarifying
              questions if needed.
            </p>

            {status === "success" && (
              <div className="mt-4 rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                Thank you! We will respond within 24 hours.
              </div>
            )}
            {status === "error" && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
                {errorMessage ?? "Something went wrong. Please try again."}
              </div>
            )}

            <div className="mt-6 space-y-4">
              <Input
                label="Name"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                {...register("email")}
                error={errors.email?.message}
              />
              <Select
                label="Service interest"
                {...register("serviceInterest")}
                error={errors.serviceInterest?.message}
              >
                <option value="bespoke-content">Bespoke Content</option>
                <option value="research">Research</option>
                <option value="ai-humanization">AI Humanization</option>
                <option value="llm-optimized">LLM-Optimized</option>
                <option value="other">Other / not sure yet</option>
              </Select>

              <Select
                label="Budget (optional)"
                {...register("budget")}
                error={errors.budget?.message}
              >
                <option value="">Select a range</option>
                <option value="under-500">Under €500</option>
                <option value="500-1000">€500–€1,000</option>
                <option value="1000-5000">€1,000–€5,000</option>
                <option value="5000-plus">€5,000+</option>
              </Select>

              <Textarea
                label="Project details"
                {...register("message")}
                error={errors.message?.message}
              />

              {/* Honeypot */}
              <div className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("website")}
                  data-testid="honeypot-website"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full justify-center mt-4"
              disabled={isSubmitting || status === "loading"}
            >
              {isSubmitting || status === "loading" ? "Sending..." : "Send Message"}
            </Button>
            </form>

            <div>
            <h2 className="text-3xl font-semibold text-text-main">
              Contact Information
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4">
                <Mail
                  className="w-6 h-6 text-accent mt-1"
                  aria-hidden="true"
                  focusable="false"
                />
                <div>
                  <p className="text-sm font-medium text-text-main">Email</p>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="text-sm text-accent underline"
                  >
                    {siteConfig.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone
                  className="w-6 h-6 text-accent mt-1"
                  aria-hidden="true"
                  focusable="false"
                />
                <div>
                  <p className="text-sm font-medium text-text-main">Phone</p>
                  <a
                    href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                    className="text-sm text-accent underline"
                  >
                    {siteConfig.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin
                  className="w-6 h-6 text-accent mt-1"
                  aria-hidden="true"
                  focusable="false"
                />
                <div>
                  <p className="text-sm font-medium text-text-main">Location</p>
                  <p className="text-sm text-text-light">
                    {siteConfig.contact.address.city}, {siteConfig.contact.address.country}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 italic text-sm text-text-light">
              We respond within 24 hours on business days.
            </p>
            <p className="mt-2 text-sm text-text-light">
              For larger projects, we are happy to schedule a video consultation.
            </p>
            </div>
          </div>
        </SectionWrapper>
      </AnimateIn>
    </main>
  );
}

