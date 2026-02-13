"use client";

import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import {
  Check,
  X,
  FileText,
  Clock,
  Users,
  Wallet,
  History,
  AlertTriangle,
  ArrowUpRight,
} from "lucide-react";
import TrendChart from "@/components/TrendChart";
import { verifyPayment } from "@/app/actions/payment";

type Payment = {
  id: number;
  userId: number;
  amount: number;
  hoursEquivalent: number;
  proofUrl: string | null;
  status: string;
  note: string | null;
  createdAt: Date;
  user: {
    name: string | null;
    nim: string | null;
    totalHours: number;
    kelas: string | null;
  };
};

type HistoryPayment = {
  id: number;
  amount: number;
  status: string;
  createdAt: Date;
  user: {
    name: string | null;
    nim: string | null;
  };
};

type Debtor = {
  id: number;
  name: string | null;
  nim: string | null;
  totalHours: number;
  kelas: string | null;
};

interface FinanceDashboardProps {
  payments: Payment[];
  stats: {
    totalIncome: number;
    pendingIncome: number;
    totalDebtors: number;
    totalOutstandingHours: number;
  };
  history: HistoryPayment[];
  debtors: Debtor[];
  trendData?: { month: string; hours: number }[];
}

export default function FinanceDashboardClient({
  payments,
  stats,
  history,
  debtors,
  trendData,
}: FinanceDashboardProps) {
  const { showConfirm, showAlert } = useDialog();
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"VERIFY" | "HISTORY" | "DEBTORS">(
    "VERIFY",
  );

  async function handleAction(id: number, action: "APPROVED" | "REJECTED") {
    const confirmed = await showConfirm(
      action === "APPROVED"
        ? "Setujui pembayaran ini? Jam kompen mahasiswa akan dikurangi otomatis."
        : "Tolak pembayaran ini?",
      "Konfirmasi Validasi",
    );

    if (!confirmed) return;

    const res = await verifyPayment(id, action);
    if (res?.error) {
      showAlert(res.error, "Gagal Memproses");
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 transition-colors duration-300 sm:px-8 dark:bg-slate-950">
      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-white">
            Finance Portal
          </h1>
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Pusat Manajemen Keuangan & Kompensasi
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-green-500/30 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-green-100 p-3 text-green-600 transition-transform duration-300 group-hover:scale-110 dark:bg-green-500/10 dark:text-green-500">
              <Wallet size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Total Pemasukan
            </p>
            <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
              Rp {stats.totalIncome.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-orange-500/30 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-600 transition-transform duration-300 group-hover:scale-110 dark:bg-orange-500/10 dark:text-orange-500">
              <Clock size={24} />
            </div>
            <span className="flex items-center rounded-lg bg-orange-100 px-2 py-1 text-xs font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-500">
              Pending
            </span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Potensi Pemasukan
            </p>
            <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
              Rp {stats.pendingIncome.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-red-500/30 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-red-100 p-3 text-red-600 transition-transform duration-300 group-hover:scale-110 dark:bg-red-500/10 dark:text-red-500">
              <Users size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Mahasiswa Berhutang
            </p>
            <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
              {stats.totalDebtors}{" "}
              <span className="text-base font-medium text-gray-400 dark:text-gray-500">Orang</span>
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-purple-500/30 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-purple-100 p-3 text-purple-600 transition-transform duration-300 group-hover:scale-110 dark:bg-purple-500/10 dark:text-purple-500">
              <AlertTriangle size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Total Jam Hutang
            </p>
            <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
              {stats.totalOutstandingHours.toLocaleString("id-ID")}{" "}
              <span className="text-base font-medium text-gray-400 dark:text-gray-500">Jam</span>
            </h3>
          </div>
        </div>
      </div>

      {trendData && trendData.length > 0 && (
        <div className="rounded-[2.5rem] border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
          <TrendChart
            data={trendData}
            color="#F4B41A"
            title="Tren Pemasukan Jam Kompensasi"
          />
        </div>
      )}

      <div className="flex w-fit gap-2 rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
        {[
          { id: "VERIFY", label: "Verifikasi Pembayaran", icon: Check },
          { id: "HISTORY", label: "Riwayat Transaksi", icon: History },
          { id: "DEBTORS", label: "Data Penunggak", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "VERIFY" | "HISTORY" | "DEBTORS")
            }
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${activeTab === tab.id
              ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
              : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {tab.id === "VERIFY" && payments.length > 0 && (
              <span className="ml-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                {payments.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "VERIFY" &&
          (payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-gray-200 bg-white py-20 dark:border-white/5 dark:bg-[#0d1117]">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 dark:bg-white/5">
                <FileText size={32} className="text-gray-900 opacity-20 dark:text-white" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                Semua Bersih!
              </h3>
              <p className="max-w-md text-center text-gray-500 dark:text-gray-400">
                Tidak ada pembayaran yang perlu divalidasi saat ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="animate-in slide-in-from-bottom-4 flex flex-col items-start gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-[#0d1117] lg:flex-row lg:items-center"
                >
                  <div className="flex-1 space-y-1">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-xs font-bold tracking-wider text-purple-600 uppercase">
                        #{payment.id}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {payment.user.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{payment.user.nim}</span>
                      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                      <span>{payment.user.kelas}</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                        <div className="text-xs font-bold text-gray-400 uppercase">
                          Bayar
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          Rp {payment.amount.toLocaleString("id-ID")}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-green-700">
                        <div className="text-xs font-bold uppercase opacity-70">
                          Konversi
                        </div>
                        <div className="flex items-center gap-1 font-bold">
                          <Clock size={14} />
                          {payment.hoursEquivalent} Jam
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-4 lg:w-auto">
                    {payment.proofUrl && (
                      <button
                        onClick={() => setSelectedProof(payment.proofUrl)}
                        className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        Lihat Bukti
                      </button>
                    )}
                    <div className="flex flex-1 gap-2 lg:flex-none">
                      <button
                        onClick={() => handleAction(payment.id, "REJECTED")}
                        className="flex-1 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 transition-colors hover:bg-red-100 lg:flex-none"
                      >
                        <X size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(payment.id, "APPROVED")}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-black dark:bg-[#008C9D] dark:hover:bg-[#007A8A] lg:flex-none"
                      >
                        <Check size={18} />
                        <span>Setujui</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

        {activeTab === "HISTORY" && (
          <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/5">
                <tr>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    ID
                  </th>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Mahasiswa
                  </th>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Nominal
                  </th>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Status
                  </th>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {history.map((tx) => (
                  <tr
                    key={tx.id}
                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="p-6 text-sm font-bold text-gray-500 dark:text-gray-400">
                      #{tx.id}
                    </td>
                    <td className="p-6">
                      <div className="font-bold text-gray-900 dark:text-white">
                        {tx.user.name}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{tx.user.nim}</div>
                    </td>
                    <td className="p-6 font-mono font-bold text-gray-900 dark:text-white">
                      Rp {tx.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-6">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${tx.status === "APPROVED"
                          ? "border-green-100 bg-green-50 text-green-700"
                          : tx.status === "REJECTED"
                            ? "border-red-100 bg-red-50 text-red-700"
                            : "border-gray-200 bg-gray-100 text-gray-600"
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400">
                      Belum ada riwayat transaksi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "DEBTORS" && (
          <div className="overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-white/5">
                <tr>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Mahasiswa
                  </th>
                  <th className="p-6 text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Kelas
                  </th>
                  <th className="p-6 text-right text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Total Hutang
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {debtors.map((mhs) => (
                  <tr
                    key={mhs.id}
                    className="group transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="p-6">
                      <div className="font-bold text-gray-900 dark:text-white">{mhs.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">{mhs.nim}</div>
                    </td>
                    <td className="p-6 text-sm font-bold text-gray-500 dark:text-gray-400">
                      {mhs.kelas || "-"}
                    </td>
                    <td className="p-6 text-right">
                      <span className="rounded-lg bg-red-50 px-3 py-1 font-black text-red-600">
                        {mhs.totalHours} Jam
                      </span>
                    </td>
                  </tr>
                ))}
                {debtors.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-12 text-center text-gray-400">
                      Hore! Tidak ada mahasiswa yang memiliki tunggakan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/95 p-4 backdrop-blur-md"
          onClick={() => setSelectedProof(null)}
        >
          <div
            className="animate-in zoom-in-95 relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 dark:bg-[#0d1117]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-white/5">
              <h3 className="font-bold text-gray-900 dark:text-white">Bukti Pembayaran</h3>
              <button
                onClick={() => setSelectedProof(null)}
                className="rounded-full bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-gray-400 dark:hover:bg-white/20"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-auto bg-gray-50 p-4 dark:bg-black/20">
              <img
                src={selectedProof}
                alt="Bukti Pembayaran"
                className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-sm"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.parentElement?.classList.add("flex-col");
                }}
              />
              <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center p-8 text-center">
                <p className="mb-2 font-medium text-gray-400">
                  Preview mungkin tidak tersedia untuk jenis link ini.
                </p>
                <p className="text-xs text-gray-300">
                  Silahkan buka link asli di bawah.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 bg-white p-4 dark:border-white/5 dark:bg-[#0d1117]">
              <button
                onClick={() => setSelectedProof(null)}
                className="rounded-xl px-4 py-2 font-bold text-gray-600 transition-colors hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5"
              >
                Tutup
              </button>
              <a
                href={selectedProof}
                target="_blank"
                rel="noopener noreferrer"
                className="flex transform items-center gap-2 rounded-xl bg-[#008C9D] px-6 py-2 font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A] active:scale-95"
              >
                <span>Buka Link Asli</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
