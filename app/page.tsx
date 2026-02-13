"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LandingPage() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".hero-text-1", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        skewY: 5,
      })
        .from(
          ".hero-text-2",
          {
            y: 100,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out",
            skewY: 5,
          },
          "-=1",
        )
        .from(
          ".hero-desc",
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.8",
        )
        .from(
          ".hero-btn",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.6",
        );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-white transition-colors duration-500 dark:bg-gray-950"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#008C9D]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <main className="relative z-10 mx-auto mt-[-5vh] max-w-5xl px-4 text-center">
        <div className="mb-2 overflow-hidden">
          <h1 className="hero-text-1 text-[8vw] leading-none font-black tracking-tighter text-gray-900 mix-blend-multiply md:text-[7rem] dark:text-gray-200 dark:mix-blend-normal">
            SISTEM
          </h1>
        </div>

        <div className="mb-8 overflow-hidden">
          <h1 className="hero-text-2 text-[8vw] leading-none font-black tracking-tighter text-[#008C9D] md:text-[7rem]">
            KOMPENSASI
          </h1>
        </div>

        <p className="hero-desc mx-auto mb-12 max-w-2xl text-lg leading-relaxed font-light text-gray-500 md:text-2xl dark:text-gray-400">
          Platform digital{" "}
          <span className="font-medium text-gray-900 dark:text-gray-200">
            Politeknik Negeri Jakarta
          </span>{" "}
          untuk manajemen jam kompensasi mahasiswa yang transparan dan
          terintegrasi.
        </p>

        <Link
          href="/login"
          className="hero-btn group relative inline-flex items-center justify-center"
        >
          <div className="absolute -inset-px rounded-full bg-gradient-to-r from-[#008C9D] to-[#007A8A] transition-all duration-200 group-hover:shadow-lg group-hover:shadow-[#008C9D]/50" />
          <div className="relative flex items-center gap-3 rounded-full bg-[#008C9D] px-10 py-5 text-lg font-bold text-white transition-colors duration-200 group-hover:bg-[#007A8A]">
            <span>Masuk Portal</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </Link>
      </main>

      <div className="absolute right-0 bottom-10 left-0 z-10 text-center">
        <p className="text-sm font-medium tracking-widest text-gray-300 uppercase dark:text-gray-700">
          Designed for Excellence
        </p>
      </div>
    </div>
  );
}
