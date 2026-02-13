"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { login } from "@/app/actions/auth";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const container = useRef(null);
  const formRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      tl.from(".left-panel", {
        xPercent: -100,
        duration: 1.2,
        ease: "power4.out",
      })
        .from(
          formRef.current,
          {
            opacity: 0,
            x: 50,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .from(
          ".input-group",
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4",
        );
    },
    { scope: container },
  );

  const handleSubmit = async (formData: FormData) => {
    setErrorMsg(null);
    setIsLoading(true);

    const result = await login(formData);

    if (result?.error) {
      setErrorMsg(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={container}
      className="flex min-h-screen overflow-hidden bg-white selection:bg-[#008C9D] selection:text-white"
    >
      <aside className="left-panel relative hidden w-[55%] items-center justify-center overflow-hidden bg-[#008C9D] lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.1),transparent_50%)]" />

        <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full border-[60px] border-white/5 blur-sm" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 max-w-2xl p-16 text-white">
          <div className="mb-8 drop-shadow-lg filter">
            <Image
              src="/Logo PNJ.png"
              alt="Logo Politeknik Negeri Jakarta"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="mb-8 text-6xl leading-[1.1] font-black tracking-tight">
            Sistem Informasi Kompensasi
          </h2>
          <p className="max-w-lg text-xl leading-relaxed font-medium text-white/80">
            Portal terintegrasi untuk pengelolaan data akademik, presensi, dan
            tanggungan kompensasi mahasiswa Politeknik Negeri Jakarta.
          </p>

          <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-white/60">
            <div className="h-px w-12 bg-white/30" />
            <span>PNJ Digital Services</span>
          </div>
        </div>
      </aside>

      <main className="relative flex w-full items-center justify-center bg-white p-8 text-gray-900 lg:w-[45%]">
        <div ref={formRef} className="w-full max-w-md">
          <header className="mb-10 text-center lg:text-left">
            <div className="mb-6 flex justify-center lg:hidden">
              <Image
                src="/Logo PNJ.png"
                alt="Logo Politeknik Negeri Jakarta"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <h1 className="mb-3 text-4xl font-black tracking-tighter text-gray-900">
              Selamat Datang
            </h1>
            <p className="text-lg text-gray-500">Silakan masuk ke akun Anda</p>
          </header>

          {errorMsg && (
            <div className="input-group animate-in fade-in slide-in-from-top-2 mb-8 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600 duration-300">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Gagal Masuk</h4>
                <p className="text-xs opacity-90">{errorMsg}</p>
              </div>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div className="input-group space-y-2">
              <label
                htmlFor="username"
                className="ml-1 text-sm font-bold text-gray-700"
              >
                Username / NIM
              </label>
              <div className="group relative">
                <input
                  type="text"
                  name="username"
                  id="username"
                  required
                  className="[&:-webkit-autofill]:-webkit-text-fill-color-black w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-4 font-medium text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                  placeholder="Masukkan username atau NIM"
                />
              </div>
            </div>

            <div className="input-group space-y-2">
              <div className="ml-1 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-gray-700"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-bold text-[#008C9D] hover:text-[#007A8A]"
                >
                  Lupa password?
                </a>
              </div>

              <div className="group relative">
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  className="[&:-webkit-autofill]:-webkit-text-fill-color-black w-full rounded-2xl border-2 border-gray-100 bg-gray-50 px-5 py-4 font-medium text-gray-900 placeholder-gray-400 transition-all duration-300 outline-none focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset]"
                  placeholder="Masukkan password anda"
                />
              </div>
            </div>

            <div className="input-group pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#008C9D] py-4 text-lg font-bold text-white shadow-xl shadow-[#008C9D]/20 transition-all duration-300 hover:scale-[1.02] hover:bg-[#007A8A] hover:shadow-[#008C9D]/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Memproses...</span>
                  </>
                ) : (
                  "Masuk Dashboard"
                )}
              </button>
            </div>
          </form>

          <footer className="mt-10 text-center text-xs font-semibold tracking-widest text-gray-300 uppercase">
            <p>© 2025 Politeknik Negeri Jakarta</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
