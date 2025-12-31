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

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.from(".left-panel", {
            xPercent: -100,
            duration: 1.2,
            ease: "power4.out"
        })
            .from(formRef.current, {
                opacity: 0,
                x: 50,
                duration: 1,
                ease: "power3.out"
            }, "-=0.5")
            .from(".input-group", {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }, "-=0.4");
    }, { scope: container });

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
        <div ref={container} className="min-h-screen flex overflow-hidden bg-white selection:bg-[#008C9D] selection:text-white">
            <aside className="left-panel hidden lg:flex w-[55%] relative bg-[#008C9D] items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.1),transparent_50%)]" />

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full border-[60px] border-white/5 blur-sm" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />

                <div className="relative z-10 p-16 max-w-2xl text-white">
                    <div className="mb-8 filter drop-shadow-lg">
                        <Image
                            src="/Logo PNJ.png"
                            alt="Logo Politeknik Negeri Jakarta"
                            width={120}
                            height={120}
                            className="object-contain"
                            priority
                        />
                    </div>

                    <h2 className="text-6xl font-black tracking-tight mb-8 leading-[1.1]">
                        Sistem Informasi Kompensasi
                    </h2>
                    <p className="text-white/80 text-xl leading-relaxed max-w-lg font-medium">
                        Portal terintegrasi untuk pengelolaan data akademik, presensi, dan tanggungan kompensasi mahasiswa Politeknik Negeri Jakarta.
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-white/60">
                        <div className="h-px w-12 bg-white/30" />
                        <span>PNJ Digital Services</span>
                    </div>
                </div>
            </aside>

            <main className="w-full lg:w-[45%] flex items-center justify-center p-8 bg-white text-gray-900 relative">


                <div ref={formRef} className="w-full max-w-md">
                    <header className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <Image
                                src="/Logo PNJ.png"
                                alt="Logo Politeknik Negeri Jakarta"
                                width={80}
                                height={80}
                                className="object-contain"
                            />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-3">Selamat Datang</h1>
                        <p className="text-gray-500 text-lg">Silakan masuk ke akun Anda</p>
                    </header>

                    {errorMsg && (
                        <div className="input-group mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-600">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">Gagal Masuk</h4>
                                <p className="text-xs opacity-90">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    <form action={handleSubmit} className="space-y-6">
                        <div className="input-group space-y-2">
                            <label htmlFor="username" className="text-sm font-bold text-gray-700 ml-1">Username / NIM</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 transition-all duration-300 placeholder-gray-400 text-gray-900 font-medium [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:-webkit-text-fill-color-black"
                                    placeholder="Masukkan username atau NIM"
                                />
                            </div>
                        </div>

                        <div className="input-group space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label>
                                <a href="#" className="text-sm font-bold text-[#008C9D] hover:text-[#007A8A]">Lupa password?</a>
                            </div>

                            <div className="relative group">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl outline-none focus:border-[#008C9D] focus:bg-white focus:ring-4 focus:ring-[#008C9D]/10 transition-all duration-300 placeholder-gray-400 text-gray-900 font-medium [&:-webkit-autofill]:shadow-[0_0_0_1000px_white_inset] [&:-webkit-autofill]:-webkit-text-fill-color-black"
                                    placeholder="Masukkan password anda"
                                />
                            </div>
                        </div>

                        <div className="input-group pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-[#008C9D] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#008C9D]/20 hover:bg-[#007A8A] hover:shadow-[#008C9D]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Memproses...</span>
                                    </>
                                ) : "Masuk Dashboard"}
                            </button>
                        </div>
                    </form>

                    <footer className="mt-10 text-center text-xs font-semibold text-gray-300 uppercase tracking-widest">
                        <p>© 2025 Politeknik Negeri Jakarta</p>
                    </footer>
                </div>
            </main>
        </div>
    );
}
