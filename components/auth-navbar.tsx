"use client";

import Image from "next/image";

type Variant = "signin" | "signup";

export default function AuthNavbar({
  variant = "signin",
}: {
  variant?: Variant;
}) {
  void variant;

  return (
    <header className="relative z-20 bg-brand text-white shadow-md">
      <div className="mx-8 flex h-16 max-w-7xl items-center px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Image
            src="/silverbird_sch_logo.png"
            alt="Silverbird International School logo"
            width={30}
            height={30}
            className="h-10 w-auto rounded-full bg-white p-0.5"
            priority
          />
          <h1 className="text-xl font-semibold tracking-wide">
            Silverbird International School
          </h1>
        </div>
      </div>
    </header>
  );
}
