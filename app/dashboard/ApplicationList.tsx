"use client";
import { Check, X, Clock, FileCheck, Play, Briefcase } from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/applications";
import { useState } from "react";

type Application = {
    id: number;
    user: { name: string | null; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
    appliedAt: Date;
};

interface ApplicationListProps {
    applications: Application[];
    variant: 'PENDING' | 'ACCEPTED';
    title?: string;
}

export default function ApplicationList({ applications, variant, title }: ApplicationListProps) {
    const [optimisticApps, setOptimisticApps] = useState(applications);

    async function handleAction(id: number, action: 'ACCEPT' | 'REJECT' | 'COMPLETE') {
        const originalApps = [...optimisticApps];
        setOptimisticApps(prev => prev.filter(app => app.id !== id));

        let status: 'ACCEPTED' | 'REJECTED' | 'COMPLETED';
        if (action === 'ACCEPT') status = 'ACCEPTED';
        else if (action === 'REJECT') status = 'REJECTED';
        else status = 'COMPLETED';

        const res = await updateApplicationStatus(id, status);
        if (res?.error) {
            alert(res.error);
            setOptimisticApps(originalApps);
        }
    }

    if (optimisticApps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                <div className="w-16 h-16 bg-white rounded-[2rem] shadow-xl shadow-gray-100 flex items-center justify-center mb-4 transform rotate-3 transition-transform hover:rotate-6 duration-300">
                    <FileCheck size={32} className="text-[#008C9D]" />
                </div>
                <h3 className="text-lg font-black text-gray-900 mb-1">{title || "Semua Beres!"}</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto px-4">
                    {variant === 'PENDING'
                        ? "Tidak ada permintaan validasi yang perlu diproses."
                        : "Tidak ada pekerjaan yang sedang berjalan."}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {optimisticApps.map((app) => (
                <div key={app.id} className="group relative flex flex-col lg:flex-row lg:items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl hover:border-[#008C9D]/30 hover:shadow-xl hover:shadow-[#008C9D]/5 transition-all duration-300 gap-6">
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#008C9D] rounded-r-full lg:opacity-0 lg:group-hover:opacity-100 transition-opacity" />

                    <div className="flex-1 pl-2 lg:pl-0">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008C9D] to-[#007A8A] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-[#008C9D]/20">
                                {app.user.name ? app.user.name.charAt(0).toUpperCase() : 'M'}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 group-hover:text-[#008C9D] transition-colors line-clamp-1">
                                    {app.user.name || 'Mahasiswa'}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                                        {app.user.nim}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#CE2029] bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                                        {app.user.totalHours} Jam Utang
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pl-14">
                            <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                                {variant === 'PENDING' ? 'Melamar untuk: ' : 'Sedang mengerjakan: '}
                                <span className="font-bold text-gray-900">{app.job.title}</span>
                            </p>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-400">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                    <Clock size={12} className="text-[#008C9D]" />
                                    {new Date(app.appliedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto pl-14 lg:pl-6 lg:border-l lg:border-gray-200">
                        {variant === 'PENDING' ? (
                            <>
                                <button
                                    onClick={() => handleAction(app.id, 'REJECT')}
                                    className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-transparent hover:border-red-100"
                                    title="Tolak"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={() => handleAction(app.id, 'ACCEPT')}
                                    className="flex-1 lg:flex-none h-12 px-6 rounded-2xl bg-[#008C9D] text-white font-bold shadow-lg shadow-[#008C9D]/20 hover:bg-[#0d9488] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                    title="Terima"
                                >
                                    <Play size={18} fill="currentColor" />
                                    <span className="hidden sm:inline">Terima</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => handleAction(app.id, 'COMPLETE')}
                                className="flex-1 lg:flex-none h-12 px-6 rounded-2xl bg-green-600 text-white font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                title="Selesai"
                            >
                                <Check size={18} />
                                <span className="hidden sm:inline">Selesai</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
