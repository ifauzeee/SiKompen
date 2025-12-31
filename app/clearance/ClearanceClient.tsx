"use client";

import { useRef, useState, useTransition } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Wallet, Upload, Loader2, Info } from "lucide-react";
import { createPayment } from "@/app/actions/payment";
import { useDialog } from "@/contexts/DialogContext";
import React from 'react';

export default function ClearanceClient({ currentDebt, userId, bankInfo }: { currentDebt: number, userId: number, bankInfo: string }) {
    const container = useRef(null);
    const { showAlert, showConfirm } = useDialog();
    const isEligible = currentDebt <= 0;
    const [isPaying, setIsPaying] = useState(false);

    const [payHours] = useState<number>(currentDebt);
    const [proofFile, setProofFile] = useState<string | null>(null);
    const [isSubmitting, startTransition] = useTransition();

    const RATE_PER_HOUR = 10000;
    const totalAmount = payHours * RATE_PER_HOUR;

    const requirements = [
        { id: 1, label: "Lunasi Seluruh Jam Kompen", Met: isEligible, desc: `${Math.max(0, currentDebt)} jam tersisa.` },
        { id: 2, label: "Bebas Pustaka", Met: true, desc: "Tidak ada tanggungan buku di perpustakaan." },
        { id: 3, label: "Administrasi Prodi", Met: true, desc: "Berkas administrasi semester ini lengkap." },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (payHours <= 0 || payHours > currentDebt) {
            showAlert("Jumlah jam tidak valid.", "Error");
            return;
        }

        if (!proofFile) {
            showAlert("Mohon upload bukti pembayaran.", "Error");
            return;
        }

        const confirmed = await showConfirm(
            `Anda akan membayar Rp ${totalAmount.toLocaleString('id-ID')} untuk ${payHours} jam kompen. Lanjutkan?`,
            "Konfirmasi Pembayaran"
        );

        if (!confirmed) return;

        startTransition(async () => {
            const res = await createPayment(
                userId,
                totalAmount,
                payHours,
                proofFile,
                "Pembayaran Mandiri via Web"
            );

            if (res.error) {
                showAlert(res.error, "Gagal");
            } else {
                showAlert("Pembayaran berhasil dikirim! Silahkan tunggu validasi dari bagian Keuangan.", "Berhasil");
                setIsPaying(false);
                setProofFile(null);
            }
        });
    };

    return (
        <div ref={container} className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8 animate-in fade-in duration-700">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 relative">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#008C9D]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Bebas <span className="text-[#008C9D]">Kompen</span>
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Status kelayakan pengajuan surat bebas kompensasi Anda.
                    </p>
                </div>

                {!isEligible && (
                    <button
                        onClick={() => setIsPaying(!isPaying)}
                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        <Wallet size={20} />
                        <span>{isPaying ? 'Batal Bayar' : 'Bayar Kompen'}</span>
                    </button>
                )}
            </header>

            {isPaying && !isEligible && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Wallet className="text-[#008C9D]" />
                        Form Pembayaran Kompen
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                                    <Info size={18} />
                                    Informasi Pembayaran
                                </h4>
                                <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                                    <li>Biaya kompen adalah <strong>Rp 10.000</strong> per jam.</li>
                                    <li>Anda memiliki hutang <strong>{currentDebt} jam</strong>.</li>
                                    <li>Silahkan transfer ke Bank <strong>{bankInfo}</strong>.</li>
                                    <li>Upload bukti transfer pada form disamping.</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                <label className="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tagihan</label>
                                <div className="text-4xl font-black text-gray-900 flex items-baseline gap-1">
                                    <span className="text-lg text-gray-400 font-bold">Rp</span>
                                    {totalAmount.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <input type="hidden" name="payHours" value={payHours} />

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Bukti Transfer</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    {proofFile ? (
                                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                            <CheckCircle2 size={24} />
                                            <span>File Teripilih</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-gray-600">
                                            <Upload size={24} />
                                            <span className="font-medium">Klik untuk upload gambar</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || payHours <= 0 || !proofFile}
                                className="w-full py-4 rounded-xl bg-[#008C9D] text-white font-bold hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
                                <span>Kirim Pembayaran</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                <div className="lg:col-span-4 flex flex-col">
                    <div className="relative mb-8">
                        <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${isEligible ? 'bg-[#008C9D]' : 'bg-[#F4B41A]'}`} />

                        <div className="relative">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Sisa Tanggungan</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-9xl font-black tracking-tighter leading-none ${isEligible ? 'text-[#008C9D]' : 'text-[#F4B41A]'}`}>
                                    {Math.max(0, currentDebt)}
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
                            <div key={req.id} className="py-8 border-b border-gray-100 flex items-start gap-6 group hover:bg-gray-50/80 transition-all duration-300 rounded-3xl px-6 -mx-6">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 transform group-hover:scale-110 
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
