"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Stethoscope,
} from "lucide-react";
import type { HeroSlide } from "@/generated/prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { WhatsAppIcon } from "@/lib/icons/whatsapp";
import { SITE } from "@/lib/constants";

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplay = useRef(
    Autoplay({ delay: 6500, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="w-full font-sans my-2 sm:my-3 lg:my-4">
      <div className="relative overflow-hidden border border-border bg-card shadow-xs">
        <Carousel
          setApi={setApi}
          opts={{ loop: true, align: "start" }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="ml-0 flex items-stretch">
            {slides.map((slide, index) => (
              <CarouselItem key={slide.id} className="pl-0 basis-full flex">
                <div className="grid w-full min-h-55 sm:min-h-70 lg:min-h-85 grid-cols-2 items-stretch">
                  <div className="flex flex-col justify-between p-3 sm:p-6 lg:p-8 z-10">
                    <div className="flex flex-col gap-1.5 sm:gap-2.5">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="inline-flex items-center gap-1 bg-sky-50 px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-sky-700 border border-sky-200/70">
                          {slide.eyebrow}
                        </span>
                        {slide.pillTop && (
                          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground border-l border-border pl-2.5">
                            {slide.pillTop}
                          </span>
                        )}
                      </div>

                      <h1 className="text-xs sm:text-xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight sm:leading-snug">
                        {slide.title}{" "}
                        {slide.accent && (
                          <span className="text-primary block sm:inline font-extrabold">
                            {slide.accent}
                          </span>
                        )}
                      </h1>

                      <p className="text-[10px] sm:text-xs lg:text-xl text-muted-foreground leading-normal sm:leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-xl">
                        {slide.description}
                      </p>
                    </div>

                    <div className="mt-2 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2.5 border-t border-border/80 pt-2 sm:pt-4">
                      <Link
                        href={slide.href}
                        className="inline-flex h-7 sm:h-9 items-center justify-center gap-1 sm:gap-2 bg-primary px-2.5 sm:px-4 text-[10px] sm:text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 shadow-2xs"
                      >
                        <span>Explore</span>
                        <ArrowRight
                          className="size-3 sm:size-3.5"
                          aria-hidden="true"
                        />
                      </Link>

                      <a
                        href={`https://wa.me/${SITE.whatsappNumber}?text=Hello%20Zanmed%20Sales%20Desk,%20I%20would%20like%20to%20request%20a%20quotation.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-7 sm:h-9 items-center justify-center gap-1 sm:gap-1.5 border border-[#1f9d55] bg-[#1f9d55] px-2 sm:px-3.5 text-[10px] sm:text-xs font-bold text-white transition-colors hover:bg-[#20BD5C]"
                      >
                        <WhatsAppIcon className="size-3 sm:size-6 shrink-0 fill-current text-white" />
                        <span>Request LPO</span>
                      </a>
                    </div>
                  </div>

                  <div className="relative w-full h-full bg-slate-50/70 border-l border-border flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      sizes="50vw"
                      className="object-contain p-2 sm:p-3"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {slides.length > 1 && (
          <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-4 z-20 flex items-center gap-2 sm:gap-3 border border-border bg-card/95 px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs shadow-xs backdrop-blur-xs">
            <span className="font-bold text-foreground">
              0{current + 1}
              <span className="text-muted-foreground"> / 0{slides.length}</span>
            </span>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={[
                    "h-1 sm:h-1.5-full transition-all",
                    i === current
                      ? "w-3 sm:w-4 bg-primary"
                      : "w-1 sm:w-1.5 bg-border hover:bg-primary/50",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="flex items-center gap-0.5 sm:gap-1 border-l border-border pl-1.5 sm:pl-2">
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous slide"
                className="flex size-5 sm:size-6 items-center justify-center-xs border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronLeft className="size-3 sm:size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                aria-label="Next slide"
                className="flex size-5 sm:size-6 items-center justify-center-xs border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <ChevronRight className="size-3 sm:size-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust Features Bar */}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-2.5 border border-border bg-card p-2 sm:p-2.5">
          <ShieldCheck className="size-3.5 sm:size-4 shrink-0 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-[11px] sm:text-xs leading-tight">
              ISO Certified Supply
            </span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
              Manufacturer Warranties Included
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 border border-border bg-card p-2 sm:p-2.5">
          <Truck className="size-3.5 sm:size-4 shrink-0 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-[11px] sm:text-xs leading-tight">
              Kenya-Wide Delivery
            </span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
              Cold-Chain & Bulk Logistics
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 border border-border bg-card p-2 sm:p-2.5">
          <Stethoscope className="size-3.5 sm:size-4 shrink-0 text-primary" />
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-[11px] sm:text-xs leading-tight">
              Biomedical Technical Support
            </span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground leading-tight">
              Installation & Technical Service
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
