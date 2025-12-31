"use client";

import { useRef } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck } from "lucide-react";

export default function ClearanceClient({ currentDebt }: { currentDebt: number }) {
    const container = useRef(null);
    const maxDebt: number = 50;
    const isEligible = currentDebt === 0;

    const requirements = [
        { id: 1, label: "Lunasi Seluruh Jam Kompen", Met: isEligible, desc: `${currentDebt} jam tersisa dari total ${maxDebt} jam batas.` },
        { id: 2, label: "Bebas Pustaka", Met: true, desc: "Tidak ada tanggungan buku di perpustakaan." },
        { id: 3, label: "Administrasi Prodi", Met: true, desc: "Berkas administrasi semester ini lengkap." },
    ];

    return (
        <div ref={container} className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Bebas <span className="text-[#008C9D]">Kompen</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Status kelayakan pengajuan surat bebas kompensasi Anda untuk semester ini.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                <div className="lg:col-span-4 flex flex-col">
                    <div className="relative mb-8">
                        <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${isEligible ? 'bg-[#008C9D]' : 'bg-[#F4B41A]'}`} />

                        <div className="relative">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Sisa Tanggungan</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-9xl font-black tracking-tighter leading-none ${isEligible ? 'text-[#008C9D]' : 'text-[#F4B41A]'}`}>
                                    {currentDebt}
                                </span>
                                <span className="text-4xl font-bold text-gray-300">Jam</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-lg font-medium text-gray-800 leading-relaxed">
                            {isEligible
                                ? "Luar biasa! Seluruh kewajiban kompen Anda telah tuntas."
                                : "Anda belum memenuhi syarat. Segera selesaikan sisa jam kompen Anda sebelum tenggat waktu."
                            }
                        </p>

                        <button
                            disabled={!isEligible}
                            className={`group flex items-center gap-4 text-lg font-bold transition-all
                            ${isEligible
                                    ? 'text-[#008C9D] hover:gap-6'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {isEligible ? "Unduh Surat Keterangan" : "Belum Tersedia"}
                            <ArrowRight className={`w-6 h-6 ${isEligible ? 'text-[#008C9D]' : 'text-gray-200'}`} />
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-gray-400" />
                        Checklist Persyaratan
                    </h3>

                    <div className="space-y-0">
                        {requirements.map((req) => (
                            <div key={req.id} className="py-8 border-b border-gray-100 flex items-start gap-6 group">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 
                                    ${req.Met ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {req.Met ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-xl font-bold mb-2 transition-colors ${req.Met ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {req.label}
                                    </h4>
                                    <p className="text-gray-500 leading-relaxed font-medium">
                                        {req.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-gray-50 rounded-r-3xl border-l-4 border-gray-200">
                        <p className="text-gray-600 font-medium flex gap-2 items-center">
                            Note: Hubungi admin prodi jika terdapat ketidaksesuaian data pada checklist di atas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
