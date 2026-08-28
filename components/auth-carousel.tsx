"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type AuthCarouselSlide = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function AuthCarousel({ slides }: { slides: AuthCarouselSlide[] }) {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`carousel-slide ${index === activeSlide ? "active" : ""}`}>
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slide.priority ?? index === 0}
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 50vw"
            className="scale-[1.06] object-cover"
          />
        </div>
      ))}

      <div className="absolute inset-0 z-10 bg-black/20" />

      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={`${slide.src}-dot-${index}`}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setActiveSlide(index)}
            className={`h-2.5 w-2.5 rounded-full border border-white/80 transition-all duration-300 ${
              index === activeSlide ? "bg-white shadow-sm" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
