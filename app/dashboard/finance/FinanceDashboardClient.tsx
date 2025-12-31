"use client";

import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { Check, X, FileText, Clock, AlertCircle, TrendingUp, Users, Wallet, History, AlertTriangle, ArrowUpRight } from "lucide-react";
import { verifyPayment } from "@/app/actions/payment";
import Image from "next/image";

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
}

export default function FinanceDashboardClient({ payments, stats, history, debtors }: FinanceDashboardProps) {
    const { showConfirm, showAlert } = useDialog();
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'VERIFY' | 'HISTORY' | 'DEBTORS'>('VERIFY');

    async function handleAction(id: number, action: 'APPROVED' | 'REJECTED') {
        const confirmed = await showConfirm(
            action === 'APPROVED'
                ? "Setujui pembayaran ini? Jam kompen mahasiswa akan dikurangi otomatis."
                : "Tolak pembayaran ini?",
            "Konfirmasi Validasi"
        );

        if (!confirmed) return;

        const res = await verifyPayment(id, action);
        if (res?.error) {
            showAlert(res.error, "Gagal Memproses");
        }
    }

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Finance Portal
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Pusat Manajemen Keuangan & Kompensasi
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-green-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Total Pemasukan</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">Rp {stats.totalIncome.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-orange-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Clock size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-lg">
                            Pending
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Potensi Pemasukan</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">Rp {stats.pendingIncome.toLocaleString('id-ID')}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-red-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Users size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Mahasiswa Berhutang</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalDebtors} <span className="text-base text-gray-400 font-medium">Orang</span></h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-purple-500/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <AlertTriangle size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Total Jam Hutang</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-1">{stats.totalOutstandingHours.toLocaleString('id-ID')} <span className="text-base text-gray-400 font-medium">Jam</span></h3>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl w-fit">
                {[
                    { id: 'VERIFY', label: 'Verifikasi Pembayaran', icon: Check },
                    { id: 'HISTORY', label: 'Riwayat Transaksi', icon: History },
                    { id: 'DEBTORS', label: 'Data Penunggak', icon: Users },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.id === 'VERIFY' && payments.length > 0 && (
                            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{payments.length}</span>
                        )}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'VERIFY' && (
                    payments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <FileText size={32} className="opacity-20 text-gray-900" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Semua Bersih!</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Tidak ada pembayaran yang perlu divalidasi saat ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {payments.map((payment) => (
                                <div key={payment.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-6 items-start lg:items-center animate-in slide-in-from-bottom-4">
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 uppercase tracking-wider">
                                                #{payment.id}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium">
                                                {new Date(payment.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">{payment.user.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>{payment.user.nim}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{payment.user.kelas}</span>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="text-xs text-gray-400 font-bold uppercase">Bayar</div>
                                                <div className="font-bold text-gray-900">Rp {payment.amount.toLocaleString('id-ID')}</div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-100 text-green-700">
                                                <div className="text-xs font-bold uppercase opacity-70">Konversi</div>
                                                <div className="font-bold flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {payment.hoursEquivalent} Jam
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 w-full lg:w-auto items-center">
                                        {payment.proofUrl && (
                                            <button
                                                onClick={() => setSelectedProof(payment.proofUrl)}
                                                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                                            >
                                                Lihat Bukti
                                            </button>
                                        )}
                                        <div className="flex gap-2 flex-1 lg:flex-none">
                                            <button
                                                onClick={() => handleAction(payment.id, 'REJECTED')}
                                                className="flex-1 lg:flex-none px-4 py-3 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(payment.id, 'APPROVED')}
                                                className="flex-1 lg:flex-none px-6 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Check size={18} />
                                                <span>Setujui</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {activeTab === 'HISTORY' && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Mahasiswa</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Nominal</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((tx) => (
                                    <tr key={tx.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="p-6 text-sm font-bold text-gray-500">#{tx.id}</td>
                                        <td className="p-6">
                                            <div className="font-bold text-gray-900">{tx.user.name}</div>
                                            <div className="text-xs text-gray-400">{tx.user.nim}</div>
                                        </td>
                                        <td className="p-6 font-mono font-bold text-gray-900">
                                            Rp {tx.amount.toLocaleString('id-ID')}
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tx.status === 'APPROVED'
                                                ? 'bg-green-50 text-green-700 border-green-100'
                                                : tx.status === 'REJECTED'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : 'bg-gray-100 text-gray-600 border-gray-200'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-sm text-gray-500">
                                            {new Date(tx.createdAt).toLocaleDateString('id-ID')}
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-gray-400">Belum ada riwayat transaksi.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'DEBTORS' && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Mahasiswa</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Kelas</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Total Hutang</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {debtors.map((mhs) => (
                                    <tr key={mhs.id} className="group hover:bg-gray-50 transition-colors">
                                        <td className="p-6">
                                            <div className="font-bold text-gray-900">{mhs.name}</div>
                                            <div className="text-xs text-gray-400">{mhs.nim}</div>
                                        </td>
                                        <td className="p-6 text-sm text-gray-500 font-bold">
                                            {mhs.kelas || '-'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <span className="font-black text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                                                {mhs.totalHours} Jam
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {debtors.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="p-12 text-center text-gray-400">Hore! Tidak ada mahasiswa yang memiliki tunggakan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/95 backdrop-blur-md" onClick={() => setSelectedProof(null)}>
                    <div className="relative bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Bukti Pembayaran</h3>
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[300px] relative p-4">
                            <img
                                src={selectedProof}
                                alt="Bukti Pembayaran"
                                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('flex-col');
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none z-0">
                                <p className="text-gray-400 font-medium mb-2">Preview mungkin tidak tersedia untuk jenis link ini.</p>
                                <p className="text-xs text-gray-300">Silahkan buka link asli di bawah.</p>
                            </div>
                        </div>

                        <div className="p-4 bg-white border-t border-gray-100 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedProof(null)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Tutup
                            </button>
                            <a
                                href={selectedProof}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-2 bg-[#008C9D] text-white font-bold rounded-xl hover:bg-[#007A8A] transition-colors flex items-center gap-2 shadow-lg shadow-[#008C9D]/20 transform active:scale-95"
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
