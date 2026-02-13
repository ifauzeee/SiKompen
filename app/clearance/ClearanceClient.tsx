"use client";

import { useRef, useState, useTransition } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Wallet,
  Loader2,
  Info,
} from "lucide-react";
import { createPayment } from "@/app/actions/payment";
import { useDialog } from "@/contexts/DialogContext";
import React from "react";
import jsPDF from "jspdf";

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

export default function ClearanceClient({
  currentDebt,
  userId,
  bankInfo,
  isLibraryClear,
  isAdminClear,
  userData,
}: ClearanceClientProps) {
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
    doc.setFont("times", "bolditalic");

    doc.text("LUNAS KOMPEN", pageWidth / 2, pageHeight / 2, {
      align: "center",
      angle: 45,
    });

    doc.setFontSize(10);
    doc.text("Dokumen Asli SiKompen PNJ", 20, 10);

    doc.restoreGraphicsState();
    doc.setTextColor(0, 0, 0);

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text(
      "KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI",
      pageWidth / 2,
      20,
      { align: "center" },
    );
    doc.setFontSize(16);
    doc.text("POLITEKNIK NEGERI JAKARTA", pageWidth / 2, 28, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text(
      "Jalan Prof. Dr. G.A. Siwabessy, Kampus UI, Depok 16425",
      pageWidth / 2,
      35,
      { align: "center" },
    );
    doc.text("Laman: https://www.pnj.ac.id", pageWidth / 2, 40, {
      align: "center",
    });

    doc.setLineWidth(1);
    doc.line(20, 45, pageWidth - 20, 45);

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("SURAT KETERANGAN BEBAS KOMPENSASI", pageWidth / 2, 60, {
      align: "center",
    });
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 55, 61, pageWidth / 2 + 55, 61);

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const startY = 80;
    const lineHeight = 8;

    doc.text(
      "Yang bertanda tangan di bawah ini menerangkan bahwa:",
      25,
      startY,
    );

    doc.text("Nama", 35, startY + lineHeight * 2);
    doc.text(":", 65, startY + lineHeight * 2);
    doc.setFont("times", "bold");
    doc.text(userData.name, 70, startY + lineHeight * 2);
    doc.setFont("times", "normal");

    doc.text("NIM", 35, startY + lineHeight * 3);
    doc.text(":", 65, startY + lineHeight * 3);
    doc.text(userData.nim, 70, startY + lineHeight * 3);

    doc.text("Program Studi", 35, startY + lineHeight * 4);
    doc.text(":", 65, startY + lineHeight * 4);
    doc.text(userData.prodi, 70, startY + lineHeight * 4);

    doc.text("Kelas", 35, startY + lineHeight * 5);
    doc.text(":", 65, startY + lineHeight * 5);
    doc.text(userData.kelas, 70, startY + lineHeight * 5);

    const contentY = startY + lineHeight * 7;
    const textIsi = `Telah menyelesaikan seluruh kewajiban jam kompensasi (0 Jam Hutang) pada Semester Ganjil Tahun Akademik 2025/2026.`;
    const splitText = doc.splitTextToSize(textIsi, pageWidth - 50);
    doc.text(splitText, 25, contentY);

    doc.text(
      "Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.",
      25,
      contentY + 15,
    );

    const dateNow = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const ttdY = contentY + 40;
    const ttdX = pageWidth - 80;

    doc.text(`Depok, ${dateNow}`, ttdX, ttdY);
    doc.text("Kepala Bagian Administrasi", ttdX, ttdY + 6);

    doc.text("_______________________", ttdX, ttdY + 35);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    doc.text(
      `Dokumen ini digenerate sah oleh Sistem SiKompen PNJ. Doc ID: ${randomId}`,
      20,
      pageHeight - 15,
    );

    const fileName = `Surat_Bebas_Kompen_${userData.nim}.pdf`;
    doc.save(fileName);
  };

  const [isPaying, setIsPaying] = useState(false);
  const [payHours] = useState<number>(currentDebt);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, startTransition] = useTransition();

  const RATE_PER_HOUR = 10000;
  const totalAmount = payHours * RATE_PER_HOUR;

  const requirements = [
    {
      id: 1,
      label: "Lunasi Seluruh Jam Kompen",
      Met: currentDebt <= 0,
      desc: `${Math.max(0, currentDebt)} jam tersisa.`,
    },
    {
      id: 2,
      label: "Bebas Pustaka",
      Met: isLibraryClear,
      desc: isLibraryClear
        ? "Tidak ada tanggungan buku di perpustakaan."
        : "Masih ada tanggungan di perpustakaan.",
    },
    {
      id: 3,
      label: "Administrasi Prodi",
      Met: isAdminClear,
      desc: isAdminClear
        ? "Berkas administrasi semester ini lengkap."
        : "Berkas administrasi belum lengkap.",
    },
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
      `Anda akan membayar Rp ${totalAmount.toLocaleString("id-ID")} untuk ${payHours} jam kompen. Lanjutkan?`,
      "Konfirmasi Pembayaran",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      formData.append("amount", totalAmount.toString());
      formData.append("hoursEquivalent", payHours.toString());
      formData.append("proof", proofFile as File);
      formData.append("note", "Pembayaran Mandiri via Web");

      const res = await createPayment(formData);

      if (res.error) {
        showAlert(res.error, "Gagal");
      } else {
        showAlert(
          "Pembayaran berhasil dikirim! Silahkan tunggu validasi dari bagian Keuangan.",
          "Berhasil",
        );
        setIsPaying(false);
        setProofFile(null);
      }
    });
  };

  return (
    <div
      ref={container}
      className="animate-in fade-in mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 duration-700 sm:px-8"
    >
      <header className="relative mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="pointer-events-none absolute top-0 right-0 -z-10 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#008C9D]/5 blur-3xl"></div>
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
            Bebas <span className="text-[#008C9D]">Kompen</span>
          </h1>
          <p className="text-base font-medium text-gray-500 md:text-lg">
            Status kelayakan pengajuan surat bebas kompensasi Anda.
          </p>
        </div>

        {!isEligible && (
          <button
            onClick={() => setIsPaying(!isPaying)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white shadow-lg shadow-gray-200 transition-colors hover:bg-gray-800 md:w-auto"
          >
            <Wallet size={20} />
            <span>{isPaying ? "Batal Bayar" : "Bayar Kompen"}</span>
          </button>
        )}
      </header>

      {isPaying && !isEligible && (
        <div className="pos animate-in slide-in-from-top-4 mb-8 rounded-3xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 duration-500 md:rounded-[2.5rem] md:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900 md:text-2xl">
            <Wallet className="text-[#008C9D]" />
            Form Pembayaran Kompen
          </h3>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 md:p-6">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800 md:text-base">
                  <Info size={18} />
                  Informasi Pembayaran
                </h4>
                <ul className="list-inside list-disc space-y-2 text-xs text-blue-700 md:text-sm">
                  <li>
                    Biaya kompen adalah <strong>Rp 10.000</strong> per jam.
                  </li>
                  <li>
                    Anda memiliki hutang <strong>{currentDebt} jam</strong>.
                  </li>
                  <li>
                    Silahkan transfer ke Bank <strong>{bankInfo}</strong>.
                  </li>
                  <li>Upload bukti transfer pada form disamping.</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6">
                <label className="mb-2 block text-xs font-bold tracking-wider text-gray-500 uppercase md:text-sm">
                  Total Tagihan
                </label>
                <div className="flex items-baseline gap-1 text-3xl font-black text-gray-900 md:text-4xl">
                  <span className="text-base font-bold text-gray-400 md:text-lg">
                    Rp
                  </span>
                  {totalAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              <input type="hidden" name="payHours" value={payHours} />

              <div className="space-y-4">
                <label className="text-sm font-bold text-gray-700">
                  Bukti Transfer (File)
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition-all outline-none placeholder:font-normal placeholder:text-gray-400 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 md:text-base"
                  />
                  {proofFile && (
                    <p className="mt-1 text-xs text-gray-500">
                      Selected: {proofFile.name}
                    </p>
                  )}
                  <p className="text-xs leading-relaxed text-gray-400">
                    *Silahkan upload foto bukti transfer asli (struk ATM /
                    screenshot m-banking). Pastikan nominal dan tanggal terlihat
                    jelas.
                  </p>
                </div>

                {proofFile && (
                  <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 font-bold text-green-600">
                    <CheckCircle2 size={20} />
                    <span className="text-sm">File siap dikirim</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || payHours <= 0 || !proofFile}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] py-3 text-sm font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A] disabled:cursor-not-allowed disabled:opacity-50 md:py-4 md:text-base"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Wallet size={20} />
                )}
                <span>Kirim Pembayaran</span>
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-24">
        <div className="flex flex-col lg:col-span-4 lg:pl-6">
          <div className="relative mb-8">
            <div
              className={`absolute -top-10 -left-10 h-64 w-64 rounded-full opacity-20 blur-3xl ${isEligible ? "bg-[#008C9D]" : "bg-[#F4B41A]"}`}
            />

            <div className="relative">
              <h2 className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase md:text-sm">
                Sisa Tanggungan
              </h2>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-7xl leading-none font-black tracking-tighter md:text-9xl ${isEligible ? "text-[#008C9D]" : "text-[#F4B41A]"}`}
                >
                  {Math.max(0, currentDebt)}
                </span>
                <span className="text-2xl font-bold text-gray-300 md:text-4xl">
                  Jam
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-base leading-relaxed font-medium text-gray-800 md:text-lg">
              {isEligible
                ? "Luar biasa! Seluruh kewajiban kompen Anda telah tuntas."
                : "Anda belum memenuhi syarat. Segera selesaikan sisa jam kompen Anda sebelum tenggat waktu."}
            </p>

            <button
              disabled={!isEligible}
              onClick={generateLetter}
              className={`group flex items-center gap-4 text-base font-bold transition-all md:text-lg ${
                isEligible
                  ? "cursor-pointer text-[#008C9D] hover:gap-6"
                  : "cursor-not-allowed text-gray-300"
              }`}
            >
              {isEligible ? "Unduh Surat Keterangan" : "Belum Tersedia"}
              <ArrowRight
                className={`h-5 w-5 md:h-6 md:w-6 ${isEligible ? "text-[#008C9D]" : "text-gray-200"}`}
              />
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h3 className="mb-6 flex items-center gap-3 text-xl font-bold text-gray-900 md:mb-8 md:text-2xl">
            <ShieldCheck className="h-5 w-5 text-gray-400 md:h-6 md:w-6" />
            Checklist Persyaratan
          </h3>

          <div className="space-y-0">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="group -mx-4 flex items-start gap-4 rounded-3xl border-b border-gray-100 px-4 py-6 transition-all duration-300 hover:bg-gray-50/80 md:-mx-6 md:gap-6 md:px-6 md:py-8"
              >
                <div
                  className={`mt-1 flex h-8 w-8 shrink-0 transform items-center justify-center rounded-full transition-colors duration-300 group-hover:scale-110 ${req.Met ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                  {req.Met ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                <div className="flex-1">
                  <h4
                    className={`mb-1 text-lg font-bold transition-colors md:mb-2 md:text-xl ${req.Met ? "text-gray-900" : "text-gray-400"}`}
                  >
                    {req.label}
                  </h4>
                  <p className="text-sm leading-relaxed font-medium text-gray-500 md:text-base">
                    {req.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border-l-4 border-gray-200 bg-gray-50 p-4 md:mt-12 md:rounded-r-3xl md:p-6">
            <p className="flex items-center gap-2 text-sm font-medium text-gray-600 md:text-base">
              Note: Hubungi admin prodi jika terdapat ketidaksesuaian data pada
              checklist di atas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
