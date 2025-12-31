"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function LandingPage() {
  const container = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".hero-text-1", {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      skewY: 5
    })
      .from(".hero-text-2", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        skewY: 5
      }, "-=1")
      .from(".hero-desc", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.8")
      .from(".hero-btn", {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)"
      }, "-=0.6");
  }, { scope: container });

  return (
    <div ref={container} className="relative h-screen w-full overflow-hidden bg-white dark:bg-gray-950 flex flex-col items-center justify-center transition-colors duration-500">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#008C9D]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-[-5vh]">
        <div className="overflow-hidden mb-2">
          <h1 className="hero-text-1 text-[8vw] md:text-[7rem] font-black leading-none text-gray-900 dark:text-gray-200 tracking-tighter mix-blend-multiply dark:mix-blend-normal">
            SISTEM
          </h1>
        </div>

        <div className="overflow-hidden mb-8">
          <h1 className="hero-text-2 text-[8vw] md:text-[7rem] font-black leading-none text-[#008C9D] tracking-tighter">
            KOMPENSASI
          </h1>
        </div>

        <p className="hero-desc text-lg md:text-2xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mb-12">
          Platform digital <span className="text-gray-900 dark:text-gray-200 font-medium">Politeknik Negeri Jakarta</span> untuk manajemen jam kompensasi mahasiswa yang transparan dan terintegrasi.
        </p>

        <Link
          href="/login"
          className="hero-btn relative inline-flex group items-center justify-center"
        >
          <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-[#008C9D] to-[#007A8A] group-hover:shadow-lg group-hover:shadow-[#008C9D]/50" />
          <div className="px-10 py-5 text-lg font-bold text-white relative rounded-full bg-[#008C9D] group-hover:bg-[#007A8A] transition-colors duration-200 flex items-center gap-3">
            <span>Masuk Portal</span>
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </Link>
      </main>

      <div className="absolute bottom-10 left-0 right-0 text-center z-10">
        <p className="text-gray-300 dark:text-gray-700 text-sm font-medium tracking-widest uppercase">
          Designed for Excellence
        </p>
      </div>
    </div>
  );
}
