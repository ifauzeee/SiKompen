"use client";
import { Check, X, Clock, FileCheck, Play, Eye, Image, ExternalLink } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/applications";
import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

type Application = {
    id: number;
    user: { name: string | null; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
    appliedAt: Date;
    proofImage1?: string | null;
    proofImage2?: string | null;
    submissionNote?: string | null;
};

interface ApplicationListProps {
    applications: Application[];
    variant: 'PENDING' | 'ACCEPTED' | 'VERIFYING';
    title?: string;
}

export default function ApplicationList({ applications, variant, title }: ApplicationListProps) {
    const { showAlert, showConfirm } = useDialog();
    const [optimisticApps, setOptimisticApps] = useState(applications);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    async function handleAction(id: number, action: 'ACCEPT' | 'REJECT' | 'COMPLETE') {
        const originalApps = [...optimisticApps];

        if (action === 'COMPLETE') {
            const app = optimisticApps.find(a => a.id === id);

            if (!app?.proofImage1) {
                showAlert("Mahasiswa belum mengunggah bukti pengerjaan. Pekerjaan tidak dapat diselesaikan.", "Bukti Belum Ada");
                return;
            }

            const confirmed = await showConfirm(
                `Verifikasi selesai untuk ${app?.user.name}?\n\nJam kompen mahasiswa akan dikurangi ${app?.job.hours} jam.`,
                "Konfirmasi Verifikasi"
            );
            if (!confirmed) return;
        }

        setOptimisticApps(prev => prev.filter(app => app.id !== id));

        let status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        if (action === 'ACCEPT') status = 'ACCEPTED';
        else if (action === 'REJECT') status = 'REJECTED';
        else status = 'COMPLETED';

        const res = await updateApplicationStatus(id, status);
        if (res?.error) {
            showAlert(res.error, "Gagal Memproses");
            setOptimisticApps(originalApps);
        }
    }

    if (optimisticApps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[2rem] md:rounded-[2.5rem]">
                <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-gray-100 flex items-center justify-center mb-4 transform rotate-3 transition-transform hover:rotate-6 duration-300">
                    <FileCheck size={32} className="text-[#008C9D]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{title || "Semua Beres!"}</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto px-4">
                    {variant === 'PENDING'
                        ? "Tidak ada permintaan validasi yang perlu diproses."
                        : variant === 'VERIFYING'
                            ? "Tidak ada bukti pengerjaan yang perlu diverifikasi."
                            : "Tidak ada pekerjaan yang sedang berjalan."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {optimisticApps.map((app) => {
                const isExpanded = expandedId === app.id;

                return (
                    <div key={app.id} className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl hover:border-[#008C9D]/30 hover:shadow-xl hover:shadow-[#008C9D]/5 transition-all duration-300 overflow-hidden">
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${variant === 'VERIFYING' ? 'bg-purple-500' : 'bg-[#008C9D]'
                            } rounded-r-full`} />

                        <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 md:p-5 gap-4 md:gap-6">
                            <div className="flex-1 pl-2 lg:pl-0">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0 ${variant === 'VERIFYING'
                                        ? 'bg-gradient-to-br from-purple-500 to-purple-700 shadow-purple-500/20'
                                        : 'bg-gradient-to-br from-[#008C9D] to-[#007A8A] shadow-[#008C9D]/20'
                                        }`}>
                                        {app.user.name ? app.user.name.charAt(0).toUpperCase() : 'M'}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-gray-900 group-hover:text-[#008C9D] transition-colors line-clamp-1 break-words">
                                            {app.user.name || 'Mahasiswa'}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200 whitespace-nowrap">
                                                {app.user.nim}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#CE2029] bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 whitespace-nowrap">
                                                {app.user.totalHours} Jam Utang
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-0 md:pl-14">
                                    <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                        {variant === 'PENDING' ? 'Melamar untuk: ' : variant === 'VERIFYING' ? 'Mengirim bukti: ' : 'Sedang mengerjakan: '}
                                        <span className="font-bold text-gray-900">{app.job.title}</span>
                                        <span className="ml-2 text-[#008C9D] font-bold">({app.job.hours} Jam)</span>
                                    </p>
                                    <div className="flex items-center gap-3 text-xs font-medium text-gray-400 flex-wrap">
                                        <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md whitespace-nowrap">
                                            <Clock size={12} className="text-[#008C9D]" />
                                            {new Date(app.appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        {app.proofImage1 && (
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                                className="flex items-center gap-1.5 bg-purple-50 text-purple-700 px-2 py-1 rounded-md hover:bg-purple-100 transition-colors whitespace-nowrap"
                                            >
                                                <Image size={12} />
                                                Lihat Bukti
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full lg:w-auto pl-0 lg:pl-6 lg:border-l lg:border-gray-200 mt-2 lg:mt-0">
                                {variant === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(app.id, 'REJECT')}
                                            className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-red-100 shrink-0"
                                            title="Tolak"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(app.id, 'ACCEPT')}
                                            className="flex-1 lg:flex-none h-12 px-6 rounded-2xl bg-[#008C9D] text-white font-bold shadow-lg shadow-[#008C9D]/20 hover:bg-[#0d9488] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                            title="Terima"
                                        >
                                            <Play size={18} fill="currentColor" />
                                            <span className="hidden sm:inline">Terima</span>
                                        </button>
                                    </>
                                )}

                                {variant === 'ACCEPTED' && (
                                    <button
                                        disabled
                                        className="flex-1 lg:flex-none h-12 px-6 rounded-2xl bg-gray-100 text-gray-400 font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-not-allowed border border-gray-200"
                                        title="Menunggu mahasiswa mengunggah bukti"
                                    >
                                        <Clock size={18} />
                                        <span className="hidden sm:inline">Menunggu Bukti</span>
                                    </button>
                                )}

                                {variant === 'VERIFYING' && (
                                    <>
                                        <button
                                            onClick={() => handleAction(app.id, 'REJECT')}
                                            className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-red-100 shrink-0"
                                            title="Tolak Bukti"
                                        >
                                            <X size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(app.id, 'COMPLETE')}
                                            className="flex-1 lg:flex-none h-12 px-6 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                                            title="Verifikasi & Potong Jam"
                                        >
                                            <Check size={18} />
                                            <span className="hidden sm:inline">Verifikasi</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {isExpanded && app.proofImage1 && (
                            <div className="px-5 pb-5 pt-0 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                                    <h5 className="font-bold text-gray-700 flex items-center gap-2">
                                        <Eye size={16} />
                                        Bukti Pengerjaan yang Dikirim
                                    </h5>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <a
                                            href={app.proofImage1}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-[#008C9D] hover:shadow-lg transition-all group/link"
                                        >
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                <Image size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900">Foto Sebelum</p>
                                                <p className="text-xs text-gray-400 truncate">{app.proofImage1}</p>
                                            </div>
                                            <ExternalLink size={16} className="text-gray-300 group-hover/link:text-[#008C9D]" />
                                        </a>

                                        {app.proofImage2 && (
                                            <a
                                                href={app.proofImage2}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200 hover:border-[#008C9D] hover:shadow-lg transition-all group/link"
                                            >
                                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                                    <Image size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900">Foto Sesudah</p>
                                                    <p className="text-xs text-gray-400 truncate">{app.proofImage2}</p>
                                                </div>
                                                <ExternalLink size={16} className="text-gray-300 group-hover/link:text-[#008C9D]" />
                                            </a>
                                        )}
                                    </div>

                                    {app.submissionNote && (
                                        <div className="bg-white rounded-xl p-3 border border-gray-200">
                                            <p className="text-xs text-gray-400 mb-1">Catatan dari Mahasiswa:</p>
                                            <p className="text-sm text-gray-700">{app.submissionNote}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
