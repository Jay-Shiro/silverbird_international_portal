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
    <div className="absolute inset-0 z-0 bg-black">
      {slides.map((slide, index) => (
        <div
          key={`${slide.src}-${index}`}
          className={`carousel-slide ${index === activeSlide ? "active" : ""}`}>
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={slide.priority ?? index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 z-10 bg-black/20" />
    </div>
  );
}
