"use client";

import { useState, useTransition } from "react";
import { useDialog } from "@/contexts/DialogContext";
import {
    Clock, CheckCircle2, XCircle, Upload, Loader2, Send,
    FileCheck, AlertCircle, Eye, ChevronDown, ChevronUp
} from "lucide-react";
import { submitJobProof } from "@/app/actions/applications";

export type Application = {
    id: number;
    jobId: number;
    jobTitle: string;
    jobDescription: string;
    hours: number;
    status: "PENDING" | "ACCEPTED" | "VERIFYING" | "COMPLETED" | "REJECTED";
    appliedAt: string;
    proofImage1: string | null;
    proofImage2: string | null;
    submissionNote: string | null;
};

export default function MyApplicationsClient({ applications, userTotalHours = 0 }: { applications: Application[], userTotalHours?: number }) {
    const { showAlert, showConfirm } = useDialog();
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();

    const [proofForms, setProofForms] = useState<Record<number, { proof1: string; proof2: string; note: string }>>({});

    const getStatusConfig = (status: Application["status"]) => {
        const configs = {
            PENDING: {
                bg: "bg-yellow-50",
                text: "text-yellow-700",
                border: "border-yellow-200",
                icon: <Clock className="w-4 h-4" />,
                label: "Menunggu Persetujuan"
            },
            ACCEPTED: {
                bg: "bg-blue-50",
                text: "text-blue-700",
                border: "border-blue-200",
                icon: <CheckCircle2 className="w-4 h-4" />,
                label: "Diterima - Silakan Kerjakan"
            },
            VERIFYING: {
                bg: "bg-purple-50",
                text: "text-purple-700",
                border: "border-purple-200",
                icon: <FileCheck className="w-4 h-4" />,
                label: "Menunggu Verifikasi Bukti"
            },
            COMPLETED: {
                bg: "bg-green-50",
                text: "text-green-700",
                border: "border-green-200",
                icon: <CheckCircle2 className="w-4 h-4" />,
                label: "Selesai"
            },
            REJECTED: {
                bg: "bg-red-50",
                text: "text-red-700",
                border: "border-red-200",
                icon: <XCircle className="w-4 h-4" />,
                label: "Ditolak"
            },
        };
        return configs[status] || configs.PENDING;
    };

    const getProgressWidth = (status: Application["status"]) => {
        switch (status) {
            case "PENDING": return "w-1/4";
            case "ACCEPTED": return "w-2/4";
            case "VERIFYING": return "w-3/4";
            case "COMPLETED": return "w-full";
            case "REJECTED": return "w-0";
            default: return "w-0";
        }
    };

    const handleProofChange = (appId: number, field: 'proof1' | 'proof2' | 'note', value: string) => {
        setProofForms(prev => ({
            ...prev,
            [appId]: {
                ...prev[appId],
                [field]: value
            }
        }));
    };

    const handleSubmitProof = async (appId: number) => {
        const form = proofForms[appId];
        if (!form?.proof1 || !form?.proof2) {
            showAlert("Mohon isi kedua link bukti foto (sebelum & sesudah).", "Error");
            return;
        }

        const confirmed = await showConfirm(
            "Kirim bukti pengerjaan? Pastikan link foto sudah benar. Pengawas akan memverifikasi bukti Anda.",
            "Konfirmasi Pengiriman"
        );

        if (!confirmed) return;

        startTransition(async () => {
            const res = await submitJobProof(appId, form.proof1, form.proof2, form.note || "");
            if (res?.error) {
                showAlert(res.error, "Gagal");
            } else {
                showAlert("Bukti berhasil dikirim! Tunggu verifikasi dari pengawas.", "Berhasil");
                setExpandedId(null);
            }
        });
    };

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-24 md:pb-12 space-y-6 md:space-y-8 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4 relative">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#008C9D]/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Lamaran <span className="text-[#008C9D]">Saya</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg font-medium">
                        Pantau progress dan kirim bukti pengerjaan kompen Anda.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
                {applications.length === 0 ? (
                    <div className="text-center py-12 md:py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-lg md:text-xl font-bold text-gray-400">Belum ada lamaran.</p>
                        <p className="text-gray-400 mt-2 text-sm md:text-base">Lamaran yang Anda ajukan akan muncul di sini.</p>
                    </div>
                ) : (
                    applications.map((app) => {
                        const statusConfig = getStatusConfig(app.status);
                        const isExpanded = expandedId === app.id;
                        const form = proofForms[app.id] || { proof1: '', proof2: '', note: '' };

                        return (
                            <div
                                key={app.id}
                                className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="h-1.5 bg-gray-100 relative">
                                    <div className={`absolute left-0 top-0 h-full bg-gradient-to-r from-[#008C9D] to-[#00B5CC] transition-all duration-700 ${getProgressWidth(app.status)}`} />
                                </div>

                                <div className="p-4 md:p-6">
                                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:items-center justify-between">
                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold border flex items-center gap-1.5 md:gap-2 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                                                    {statusConfig.icon}
                                                    {statusConfig.label}
                                                </span>
                                            </div>

                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                                                {app.jobTitle}
                                            </h2>

                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-gray-500">
                                                <span>Diajukan: {app.appliedAt}</span>
                                                <span className="font-bold text-[#008C9D] flex items-center gap-1">
                                                    {app.hours} Jam Kompen
                                                    <span className="text-gray-400 font-normal hidden sm:inline">(Rp {(app.hours * 10000).toLocaleString('id-ID')})</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-stretch md:items-center w-full md:w-auto mt-2 md:mt-0">
                                            {app.status === "ACCEPTED" && (
                                                <button
                                                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                                                    className="w-full md:w-auto px-4 md:px-6 py-3 bg-[#008C9D] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 text-sm md:text-base"
                                                >
                                                    <Upload size={18} />
                                                    Kirim Bukti
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            )}

                                            {app.status === "VERIFYING" && (
                                                <div className="w-full md:w-auto px-4 md:px-6 py-3 bg-purple-50 text-purple-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-purple-200 text-sm md:text-base">
                                                    <Loader2 size={18} className="animate-spin" />
                                                    Menunggu Verifikasi
                                                </div>
                                            )}

                                            {app.status === "COMPLETED" && (
                                                <div className="w-full md:w-auto px-4 md:px-6 py-3 bg-green-50 text-green-700 rounded-xl font-bold flex items-center justify-center gap-2 border border-green-200 text-sm md:text-base">
                                                    <CheckCircle2 size={18} />
                                                    Jam Terpotong
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && app.status === "ACCEPTED" && (
                                        <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4 duration-300">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                                <div className="space-y-4">
                                                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                                        <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2 text-sm md:text-base">
                                                            <AlertCircle size={18} />
                                                            Petunjuk Pengiriman Bukti
                                                        </h4>
                                                        <ul className="text-xs md:text-sm text-blue-700 space-y-1.5 list-disc list-inside">
                                                            <li>Upload foto <strong>SEBELUM</strong> mengerjakan tugas</li>
                                                            <li>Upload foto <strong>SESUDAH</strong> menyelesaikan tugas</li>
                                                            <li>Pastikan foto terlihat jelas dengan <strong>timestamp</strong></li>
                                                            <li>Upload ke Google Drive/Cloud Storage, paste linknya di form</li>
                                                            <li>Pastikan link bisa diakses publik (Anyone with the link)</li>
                                                        </ul>
                                                    </div>

                                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                                        <h4 className="font-bold text-gray-700 mb-2 text-sm md:text-base">Detail Pekerjaan</h4>
                                                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{app.jobDescription}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            📸 Foto Sebelum (Link) *
                                                        </label>
                                                        <input
                                                            type="url"
                                                            placeholder="https://drive.google.com/..."
                                                            value={form.proof1}
                                                            onChange={(e) => handleProofChange(app.id, 'proof1', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all outline-none font-medium text-sm md:text-base"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            📸 Foto Sesudah (Link) *
                                                        </label>
                                                        <input
                                                            type="url"
                                                            placeholder="https://drive.google.com/..."
                                                            value={form.proof2}
                                                            onChange={(e) => handleProofChange(app.id, 'proof2', e.target.value)}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all outline-none font-medium text-sm md:text-base"
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                                            📝 Catatan (Opsional)
                                                        </label>
                                                        <textarea
                                                            placeholder="Tambahkan catatan jika diperlukan..."
                                                            value={form.note}
                                                            onChange={(e) => handleProofChange(app.id, 'note', e.target.value)}
                                                            rows={3}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 transition-all outline-none font-medium resize-none text-sm md:text-base"
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={() => handleSubmitProof(app.id)}
                                                        disabled={isPending || !form.proof1 || !form.proof2}
                                                        className="w-full py-3 md:py-4 rounded-xl bg-[#008C9D] text-white font-bold hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                                                    >
                                                        {isPending ? (
                                                            <>
                                                                <Loader2 className="animate-spin" size={20} />
                                                                Mengirim...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send size={20} />
                                                                Kirim Bukti Pengerjaan
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {app.status === "VERIFYING" && app.proofImage1 && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-sm md:text-base">
                                                <Eye size={18} />
                                                Bukti yang Dikirim
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <a href={app.proofImage1} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-gray-50 rounded-xl text-xs md:text-sm text-[#008C9D] font-medium hover:bg-gray-100 transition-colors truncate block">
                                                    📸 Foto Sebelum: {app.proofImage1}
                                                </a>
                                                {app.proofImage2 && (
                                                    <a href={app.proofImage2} target="_blank" rel="noopener noreferrer" className="px-4 py-3 bg-gray-50 rounded-xl text-xs md:text-sm text-[#008C9D] font-medium hover:bg-gray-100 transition-colors truncate block">
                                                        📸 Foto Sesudah: {app.proofImage2}
                                                    </a>
                                                )}
                                            </div>
                                            {app.submissionNote && (
                                                <p className="mt-3 text-xs md:text-sm text-gray-500">
                                                    <strong>Catatan:</strong> {app.submissionNote}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {(() => {
                const activeApps = applications.filter(a => ['PENDING', 'ACCEPTED', 'VERIFYING'].includes(a.status));
                const totalPotentialHours = activeApps.reduce((sum, app) => sum + app.hours, 0);

                const remainingHours = Math.max(0, userTotalHours - totalPotentialHours);

                if (totalPotentialHours > 0) {
                    return (
                        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:bottom-8 md:w-auto z-40 animate-in slide-in-from-bottom-4 duration-500 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 lg:left-72 lg:translate-x-8">
                            <div className="bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-full shadow-2xl flex items-center gap-3 md:gap-4 border border-gray-800 w-full md:w-auto justify-between md:justify-start">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`p-2 rounded-full shrink-0 ${remainingHours === 0 ? 'bg-green-500' : 'bg-[#008C9D]'}`}>
                                        {remainingHours === 0 ? <CheckCircle2 size={18} className="text-white" /> : <Clock size={18} className="text-white" />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider">Estimasi Sisa</p>
                                        <p className="text-sm md:text-lg font-black text-white leading-none">
                                            {remainingHours === 0 ? (
                                                <span className="text-green-400">LUNAS</span>
                                            ) : (
                                                <>
                                                    {remainingHours} Jam
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {remainingHours > 0 && (
                                    <div className="text-right">
                                        <span className="text-[#008C9D] text-xs md:text-sm font-bold bg-[#008C9D]/10 px-2 py-1 rounded-lg">
                                            Rp {(remainingHours * 10000).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }
                return null;
            })()}
        </div>
    );
}
