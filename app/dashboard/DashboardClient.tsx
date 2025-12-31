"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
    Clock,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    FileText,
    TrendingUp,
    ShieldAlert,
    Briefcase,
    Wallet
} from "lucide-react";
import Link from "next/link";

type DashboardClientProps = {
    user: {
        name: string;
        nim: string;
        totalHours: number;
    };
    stats: {
        completedHours: number;
        activeJobs: number;
        activeJobTitle?: string;
    };
    activities: {
        id: number;
        type: 'APPROVED' | 'DONE' | 'WARNING';
        title: string;
        desc: string;
        time: string;
    }[];
};


export default function DashboardClient({ user, stats, activities }: DashboardClientProps) {
    const container = useRef(null);
    const maxDebt = 25;
    const debtPercentage = Math.min(100, Math.round((user.totalHours / maxDebt) * 100));
    const isCritical = user.totalHours > 20;



    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".welcome-text", {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1
        })
            .from(".bento-item", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1
            }, "-=0.5");
    }, { scope: container });

    return (
        <div ref={container} className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div className="welcome-text">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Selamat Datang, <span className="text-[#008C9D]">{user.name.split(' ')[0]}</span>.
                    </h1>
                    <p className="text-gray-500 text-sm md:text-lg font-medium">
                        Semester Ganjil 2025/2026 &bull; Teknik Informatika
                    </p>
                </div>
                <div className="welcome-text hidden md:flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-gray-200 shadow-sm">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold text-gray-700 text-sm">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div className="bento-item col-span-1 md:col-span-2 lg:col-span-2 row-span-2 bg-[#008C9D] text-white rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden group shadow-2xl shadow-gray-200 border border-[#007A8A]">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/10">
                                <ShieldAlert className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${isCritical ? 'bg-red-500/20 border-red-500/30 text-white' : 'bg-green-500/20 border-green-500/30 text-white'}`}>
                                {isCritical ? 'Perlu Perhatian' : 'Aman'}
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-white/70 font-medium text-xs md:text-sm uppercase tracking-widest mb-2">Sisa Tanggungan</p>
                            <div className="flex items-end gap-2 md:gap-3 mb-6">
                                <span className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
                                    {user.totalHours}
                                </span>
                                <span className="text-xl md:text-2xl font-bold text-white/50 mb-1 md:mb-2">Jam</span>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs md:text-sm font-medium text-white/70">
                                    <span>Progress Pelunasan</span>
                                    <span>{100 - debtPercentage}% Selesai</span>
                                </div>
                                <div className="w-full bg-black/20 h-3 md:h-4 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div
                                        className="h-full rounded-full bg-white relative transition-all duration-1000 ease-out"
                                        style={{ width: `${100 - debtPercentage}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/50 animate-[shimmer_2s_infinite]" />
                                    </div>
                                </div>
                                <p className="text-[10px] md:text-xs text-white/50 mt-2">Batas maksimal akumulasi: {maxDebt} Jam per semester.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bento-item col-span-1 md:col-span-1 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#CE2029]/30 transition-colors duration-300">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#CE2029]/10 text-[#CE2029] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Sedang Dikerjakan</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.activeJobs}</h3>
                    </div>

                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {stats.activeJobTitle || "Tidak ada pekerjaan aktif saat ini."}
                        </p>
                        {stats.activeJobs > 0 && (
                            <Link href="/dashboard/my-jobs" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#CE2029] hover:underline">
                                Lihat Detail <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        )}
                    </div>
                </div>

                <div className="bento-item col-span-1 md:col-span-1 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#F4B41A]/30 transition-colors duration-300">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-[#F4B41A]/10 text-[#F4B41A] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm font-bold uppercase tracking-wider">Telah Diselesaikan</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{stats.completedHours}</h3>
                    </div>
                    <div className="mt-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F4B41A]/10 text-[#F4B41A] rounded-lg text-xs font-bold">
                            <TrendingUp className="w-3 h-3" />
                            Semester Ini
                        </div>
                    </div>
                </div>

                <div className="bento-item col-span-1 md:col-span-2 lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div>
                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <h3 className="font-bold text-base md:text-lg text-gray-900 flex items-center gap-2">
                                <Wallet className="w-5 h-5 text-[#CE2029]" />
                                Estimasi Biaya Denda
                            </h3>
                            <div className="px-3 py-1 bg-[#CE2029]/10 text-[#CE2029] rounded-full text-[10px] md:text-xs font-bold">
                                Rp 10.000 / Jam
                            </div>
                        </div>

                        <div className="flex items-end gap-3 mb-2 relative z-10">
                            <span className="text-3xl md:text-5xl font-black tracking-tight text-gray-900">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(user.totalHours * 10000)}
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs md:text-sm font-medium mb-8 relative z-10">
                            Estimasi tunai jika mengkonversi seluruh sisa {user.totalHours} jam kompen.
                        </p>
                    </div>

                    <div className="relative z-10">

                        <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden p-1">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-[#CE2029] to-[#E63946] relative transition-all duration-1000 ease-out shadow-sm"
                                style={{ width: `${Math.min(100, (user.totalHours * 10000 / 250000) * 100)}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-2 font-medium">
                            *Nominal denda dihitung berdasarkan sisa jam dikalikan tarif denda per jam.
                        </p>
                    </div>
                </div>

                <div className="bento-item col-span-1 md:col-span-1 lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden flex flex-col h-full">
                    <h3 className="font-bold text-base md:text-lg text-gray-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#008C9D]" />
                        Aktivitas Terbaru
                    </h3>

                    <div className="space-y-6 overflow-y-auto pl-4 pr-1 md:pr-2 custom-scrollbar flex-1">
                        {activities.length > 0 ? activities.map((act) => (
                            <div key={act.id} className="relative pl-6 pb-6 border-l border-gray-100 last:border-0 last:pb-0 group">
                                <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white transition-colors duration-300 ${act.type === 'APPROVED' ? 'bg-[#008C9D] group-hover:bg-[#007A8A] shadow-[0_0_0_4px_rgba(0,140,157,0.2)]' :
                                    act.type === 'WARNING' ? 'bg-[#CE2029] group-hover:bg-[#B01B23] shadow-[0_0_0_4px_rgba(206,32,41,0.2)]' :
                                        'bg-[#F4B41A] group-hover:bg-[#D49B15] shadow-[0_0_0_4px_rgba(244,180,26,0.2)]'
                                    }`} />

                                <div className="mb-1 flex justify-between items-start gap-4">
                                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{act.title}</h4>
                                    <span className="text-[10px] font-semibold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">{act.time}</span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed break-words">{act.desc}</p>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                <FileText className="w-12 h-12 mb-3 opacity-20" />
                                <p>Belum ada aktivitas tercatat.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bento-item col-span-1 md:col-span-1 lg:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden flex flex-col justify-between group hover:border-[#008C9D]/30 transition-colors h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-[#008C9D]/10 text-[#008C9D] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Briefcase className="w-6 h-6" />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Cari Kompen?</h3>
                        <p className="text-gray-500 mb-6 text-sm">Temukan pekerjaan yang cocok dengan keahlianmu dan selesaikan kewajiban kompen.</p>
                    </div>

                    <Link href="/jobs" className="w-full py-3 bg-[#008C9D] text-white font-bold rounded-xl hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20 text-center flex items-center justify-center gap-2">
                        Lihat Lowongan <ArrowUpRight size={18} />
                    </Link>
                </div>

            </div>
        </div>
    );
}
