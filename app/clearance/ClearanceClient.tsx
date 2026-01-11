"use client";

import { useRef, useState, useTransition } from 'react';
import { CheckCircle2, XCircle, ArrowRight, ShieldCheck, Wallet, Loader2, Info } from "lucide-react";
import { createPayment } from "@/app/actions/payment";
import { useDialog } from "@/contexts/DialogContext";
import React from 'react';
import jsPDF from 'jspdf';

type ClearanceClientProps = {
    currentDebt: number;
    userId: number;
    bankInfo: string;
    isLibraryClear: boolean;
    isAdminClear: boolean;
    userData: {
        name: string;
        nim: string;
        prodi: string;
        kelas: string;
    };
};

export default function ClearanceClient({ currentDebt, userId, bankInfo, isLibraryClear, isAdminClear, userData }: ClearanceClientProps) {
    const container = useRef(null);
    const { showAlert, showConfirm } = useDialog();
    const isEligible = currentDebt <= 0 && isLibraryClear && isAdminClear;

    const generateLetter = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        doc.saveGraphicsState();
        doc.setTextColor(220, 220, 220);
        doc.setFontSize(60);
        doc.setFont('times', 'bolditalic');

        doc.text('LUNAS KOMPEN', pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45
        });

        doc.setFontSize(10);
        doc.text('Dokumen Asli SiKompen PNJ', 20, 10);

        doc.restoreGraphicsState();
        doc.setTextColor(0, 0, 0);

        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text('KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(16);
        doc.text('POLITEKNIK NEGERI JAKARTA', pageWidth / 2, 28, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('times', 'normal');
        doc.text('Jalan Prof. Dr. G.A. Siwabessy, Kampus UI, Depok 16425', pageWidth / 2, 35, { align: 'center' });
        doc.text('Laman: https://www.pnj.ac.id', pageWidth / 2, 40, { align: 'center' });

        doc.setLineWidth(1);
        doc.line(20, 45, pageWidth - 20, 45);

        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.text('SURAT KETERANGAN BEBAS KOMPENSASI', pageWidth / 2, 60, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 55, 61, pageWidth / 2 + 55, 61);

        doc.setFont('times', 'normal');
        doc.setFontSize(12);

        const startY = 80;
        const lineHeight = 8;

        doc.text('Yang bertanda tangan di bawah ini menerangkan bahwa:', 25, startY);

        doc.text('Nama', 35, startY + (lineHeight * 2));
        doc.text(':', 65, startY + (lineHeight * 2));
        doc.setFont('times', 'bold');
        doc.text(userData.name, 70, startY + (lineHeight * 2));
        doc.setFont('times', 'normal');

        doc.text('NIM', 35, startY + (lineHeight * 3));
        doc.text(':', 65, startY + (lineHeight * 3));
        doc.text(userData.nim, 70, startY + (lineHeight * 3));

        doc.text('Program Studi', 35, startY + (lineHeight * 4));
        doc.text(':', 65, startY + (lineHeight * 4));
        doc.text(userData.prodi, 70, startY + (lineHeight * 4));

        doc.text('Kelas', 35, startY + (lineHeight * 5));
        doc.text(':', 65, startY + (lineHeight * 5));
        doc.text(userData.kelas, 70, startY + (lineHeight * 5));

        const contentY = startY + (lineHeight * 7);
        const textIsi = `Telah menyelesaikan seluruh kewajiban jam kompensasi (0 Jam Hutang) pada Semester Ganjil Tahun Akademik 2025/2026.`;
        const splitText = doc.splitTextToSize(textIsi, pageWidth - 50);
        doc.text(splitText, 25, contentY);

        doc.text('Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.', 25, contentY + 15);

        const dateNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const ttdY = contentY + 40;
        const ttdX = pageWidth - 80;

        doc.text(`Depok, ${dateNow}`, ttdX, ttdY);
        doc.text('Kepala Bagian Administrasi', ttdX, ttdY + 6);

        doc.text('_______________________', ttdX, ttdY + 35);

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        doc.text(`Dokumen ini digenerate sah oleh Sistem SiKompen PNJ. Doc ID: ${randomId}`, 20, pageHeight - 15);

        const fileName = `Surat_Bebas_Kompen_${userData.nim}.pdf`;
        doc.save(fileName);
    };

    const [isPaying, setIsPaying] = useState(false);
    const [payHours] = useState<number>(currentDebt);
    const [proofFile, setProofFile] = useState<string | null>(null);
    const [isSubmitting, startTransition] = useTransition();

    const RATE_PER_HOUR = 10000;
    const totalAmount = payHours * RATE_PER_HOUR;

    const requirements = [
        { id: 1, label: "Lunasi Seluruh Jam Kompen", Met: currentDebt <= 0, desc: `${Math.max(0, currentDebt)} jam tersisa.` },
        { id: 2, label: "Bebas Pustaka", Met: isLibraryClear, desc: isLibraryClear ? "Tidak ada tanggungan buku di perpustakaan." : "Masih ada tanggungan di perpustakaan." },
        { id: 3, label: "Administrasi Prodi", Met: isAdminClear, desc: isAdminClear ? "Berkas administrasi semester ini lengkap." : "Berkas administrasi belum lengkap." },
    ];


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
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Bebas <span className="text-[#008C9D]">Kompen</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg font-medium">
                        Status kelayakan pengajuan surat bebas kompensasi Anda.
                    </p>
                </div>

                {!isEligible && (
                    <button
                        onClick={() => setIsPaying(!isPaying)}
                        className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                    >
                        <Wallet size={20} />
                        <span>{isPaying ? 'Batal Bayar' : 'Bayar Kompen'}</span>
                    </button>
                )}
            </header>

            {isPaying && !isEligible && (
                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 pos md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <Wallet className="text-[#008C9D]" />
                        Form Pembayaran Kompen
                    </h3>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="space-y-6">
                            <div className="p-4 md:p-6 bg-blue-50 rounded-2xl border border-blue-100">
                                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm md:text-base">
                                    <Info size={18} />
                                    Informasi Pembayaran
                                </h4>
                                <ul className="text-xs md:text-sm text-blue-700 space-y-2 list-disc list-inside">
                                    <li>Biaya kompen adalah <strong>Rp 10.000</strong> per jam.</li>
                                    <li>Anda memiliki hutang <strong>{currentDebt} jam</strong>.</li>
                                    <li>Silahkan transfer ke Bank <strong>{bankInfo}</strong>.</li>
                                    <li>Upload bukti transfer pada form disamping.</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 p-4 md:p-6 rounded-2xl border border-gray-200">
                                <label className="block text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Tagihan</label>
                                <div className="text-3xl md:text-4xl font-black text-gray-900 flex items-baseline gap-1">
                                    <span className="text-base md:text-lg text-gray-400 font-bold">Rp</span>
                                    {totalAmount.toLocaleString('id-ID')}
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} className="space-y-6">
                            <input type="hidden" name="payHours" value={payHours} />

                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700">Bukti Transfer (Link)</label>
                                <div className="space-y-2">
                                    <input
                                        type="url"
                                        placeholder="Paste link Google Drive / Dropbox di sini..."
                                        value={proofFile || ''}
                                        onChange={(e) => setProofFile(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all outline-none font-medium placeholder:font-normal placeholder:text-gray-400 text-sm md:text-base"
                                    />
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        *Silahkan upload bukti transfer ke Google Drive/Cloud Storage Anda, pastikan akses link dibuka untuk publik (Anyone with the link), lalu tempel linknya di sini.
                                    </p>
                                </div>

                                {proofFile && proofFile.length > 10 && (
                                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                                        <CheckCircle2 size={20} />
                                        <span className="text-sm">Link siap dikirim</span>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || payHours <= 0 || !proofFile}
                                className="w-full py-3 md:py-4 rounded-xl bg-[#008C9D] text-white font-bold hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" /> : <Wallet size={20} />}
                                <span>Kirim Pembayaran</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24">
                <div className="lg:col-span-4 flex flex-col lg:pl-6">
                    <div className="relative mb-8">
                        <div className={`absolute -top-10 -left-10 w-64 h-64 rounded-full blur-3xl opacity-20 ${isEligible ? 'bg-[#008C9D]' : 'bg-[#F4B41A]'}`} />

                        <div className="relative">
                            <h2 className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Sisa Tanggungan</h2>
                            <div className="flex items-baseline gap-2">
                                <span className={`text-7xl md:text-9xl font-black tracking-tighter leading-none ${isEligible ? 'text-[#008C9D]' : 'text-[#F4B41A]'}`}>
                                    {Math.max(0, currentDebt)}
                                </span>
                                <span className="text-2xl md:text-4xl font-bold text-gray-300">Jam</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <p className="text-base md:text-lg font-medium text-gray-800 leading-relaxed">
                            {isEligible
                                ? "Luar biasa! Seluruh kewajiban kompen Anda telah tuntas."
                                : "Anda belum memenuhi syarat. Segera selesaikan sisa jam kompen Anda sebelum tenggat waktu."
                            }
                        </p>

                        <button
                            disabled={!isEligible}
                            onClick={generateLetter}
                            className={`group flex items-center gap-4 text-base md:text-lg font-bold transition-all
                            ${isEligible
                                    ? 'text-[#008C9D] hover:gap-6 cursor-pointer'
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {isEligible ? "Unduh Surat Keterangan" : "Belum Tersedia"}
                            <ArrowRight className={`w-5 h-5 md:w-6 md:h-6 ${isEligible ? 'text-[#008C9D]' : 'text-gray-200'}`} />
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 md:mb-8 flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                        Checklist Persyaratan
                    </h3>

                    <div className="space-y-0">
                        {requirements.map((req) => (
                            <div key={req.id} className="py-6 md:py-8 border-b border-gray-100 flex items-start gap-4 md:gap-6 group hover:bg-gray-50/80 transition-all duration-300 rounded-3xl px-4 md:px-6 -mx-4 md:-mx-6">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 transform group-hover:scale-110 
                                    ${req.Met ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {req.Met ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`text-lg md:text-xl font-bold mb-1 md:mb-2 transition-colors ${req.Met ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {req.label}
                                    </h4>
                                    <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">
                                        {req.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 md:mt-12 p-4 md:p-6 bg-gray-50 rounded-2xl md:rounded-r-3xl border-l-4 border-gray-200">
                        <p className="text-sm md:text-base text-gray-600 font-medium flex gap-2 items-center">
                            Note: Hubungi admin prodi jika terdapat ketidaksesuaian data pada checklist di atas.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}