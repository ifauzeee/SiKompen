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
  Wallet,
  ArrowRight,
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
    type: "APPROVED" | "DONE" | "WARNING";
    title: string;
    desc: string;
    time: string;
  }[];
};

export default function DashboardClient({
  user,
  stats,
  activities,
}: DashboardClientProps) {
  const container = useRef(null);
  const maxDebt = 25;
  const debtPercentage = Math.min(
    100,
    Math.round((user.totalHours / maxDebt) * 100),
  );
  const isCritical = user.totalHours > 20;

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".welcome-text", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
      }).from(
        ".bento-item",
        {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
        },
        "-=0.5",
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 transition-colors duration-300 sm:px-8 dark:bg-slate-950"
    >
      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="welcome-text">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-white">
            Selamat Datang,{" "}
            <span className="text-[#008C9D]">{user.name?.split(" ")[0]}</span>.
          </h1>
          <p className="text-sm font-medium text-gray-500 md:text-lg dark:text-gray-400">
            Semester Ganjil 2025/2026 &bull; Teknik Informatika
          </p>
        </div>
        <div className="welcome-text flex items-center gap-4">
          <div className="hidden items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-sm md:flex dark:border-gray-800 dark:bg-gray-900">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <Link
            href="/jobs"
            className="group flex items-center gap-3 rounded-2xl bg-gray-900 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-black hover:shadow-xl active:scale-95 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            <Briefcase
              className="transition-transform group-hover:rotate-12"
              size={20}
            />
            <span>Cari Lowongan</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div className="bento-item group relative col-span-1 row-span-2 overflow-hidden rounded-[2.5rem] border border-[#007A8A] bg-[#008C9D] p-6 text-white shadow-2xl shadow-gray-200 md:col-span-2 md:p-8 lg:col-span-2">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-[80px]" />

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="rounded-2xl border border-white/10 bg-white/20 p-3 backdrop-blur-md">
                <ShieldAlert className="h-6 w-6 text-white md:h-8 md:w-8" />
              </div>
              <div
                className={`rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider uppercase ${isCritical ? "border-red-500/30 bg-red-500/20 text-white" : "border-green-500/30 bg-green-500/20 text-white"}`}
              >
                {isCritical ? "Perlu Perhatian" : "Aman"}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-2 text-xs font-medium tracking-widest text-white/70 uppercase md:text-sm">
                Sisa Tanggungan
              </p>
              <div className="mb-6 flex items-end gap-2 md:gap-3">
                <span className="text-6xl leading-none font-black tracking-tighter text-white md:text-8xl">
                  {user.totalHours}
                </span>
                <span className="mb-1 text-xl font-bold text-white/50 md:mb-2 md:text-2xl">
                  Jam
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-white/70 md:text-sm">
                  <span>Progress Pelunasan</span>
                  <span>{100 - debtPercentage}% Selesai</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-black/20 backdrop-blur-sm md:h-4">
                  <div
                    className="relative h-full rounded-full bg-white transition-all duration-1000 ease-out"
                    style={{ width: `${100 - debtPercentage}%` }}
                  >
                    <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-white/50" />
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-white/50 md:text-xs">
                  Batas maksimal akumulasi: {maxDebt} Jam per semester.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bento-item group col-span-1 flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-colors duration-300 hover:border-[#CE2029]/30 md:col-span-1 md:rounded-[2.5rem] dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-[#CE2029]/50">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-2xl bg-[#CE2029]/10 p-3 text-[#CE2029] transition-transform duration-300 group-hover:scale-110">
                <Briefcase className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase md:text-sm dark:text-gray-500">
              Sedang Dikerjakan
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
              {stats.activeJobs}
            </h3>
          </div>

          <div className="mt-4">
            <p className="line-clamp-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              {stats.activeJobTitle || "Tidak ada pekerjaan aktif saat ini."}
            </p>
            {stats.activeJobs > 0 && (
              <Link
                href="/dashboard/my-applications"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#CE2029] hover:underline"
              >
                Lihat Detail <ArrowUpRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>

        <div className="bento-item group col-span-1 flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-colors duration-300 hover:border-[#F4B41A]/30 md:col-span-1 md:rounded-[2.5rem] dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-[#F4B41A]/50">
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-2xl bg-[#F4B41A]/10 p-3 text-[#F4B41A] transition-transform duration-300 group-hover:scale-110">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase md:text-sm dark:text-gray-500">
              Telah Diselesaikan
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 dark:text-white">
              {stats.completedHours}
            </h3>
          </div>
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-[#F4B41A]/10 px-3 py-1.5 text-xs font-bold text-[#F4B41A]">
              <TrendingUp className="h-3 w-3" />
              Semester Ini
            </div>
          </div>
        </div>

        <div className="bento-item group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 md:col-span-2 md:rounded-[2.5rem] md:p-8 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[80px]" />

          <div>
            <div className="relative z-10 mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-gray-900 md:text-lg dark:text-white">
                <Wallet className="h-5 w-5 text-[#CE2029]" />
                Estimasi Biaya Denda
              </h3>
              <div className="rounded-full bg-[#CE2029]/10 px-3 py-1 text-[10px] font-bold text-[#CE2029] md:text-xs">
                Rp 10.000 / Jam
              </div>
            </div>

            <div className="relative z-10 mb-2 flex items-end gap-3">
              <span className="text-3xl font-black tracking-tight text-gray-900 md:text-5xl dark:text-white">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(user.totalHours * 10000)}
              </span>
            </div>
            <p className="relative z-10 mb-8 text-xs font-medium text-gray-400 md:text-sm dark:text-gray-500">
              Estimasi tunai jika mengkonversi seluruh sisa {user.totalHours}{" "}
              jam kompen.
            </p>
          </div>

          <div className="relative z-10">
            <div className="h-6 w-full overflow-hidden rounded-full bg-gray-100 p-1 dark:bg-gray-800">
              <div
                className="relative h-full rounded-full bg-linear-to-r from-[#CE2029] to-[#E63946] shadow-sm transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(100, ((user.totalHours * 10000) / 250000) * 100)}%`,
                }}
              >
                <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-white/30" />
              </div>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-400 dark:text-gray-600">
              *Nominal denda dihitung berdasarkan sisa jam dikalikan tarif denda
              per jam.
            </p>
          </div>
        </div>

        <div className="bento-item col-span-1 flex h-full flex-col overflow-hidden rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 md:col-span-1 md:rounded-[2.5rem] md:p-8 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none">
          <h3 className="mb-6 flex items-center gap-2 text-base font-bold text-gray-900 md:text-lg dark:text-white">
            <Clock className="h-5 w-5 text-[#008C9D]" />
            Aktivitas Terbaru
          </h3>

          <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-1 pl-4 md:pr-2">
            {activities.length > 0 ? (
              activities.map((act) => (
                <div
                  key={act.id}
                  className="group relative border-l border-gray-100 pb-6 pl-6 last:border-0 last:pb-0 dark:border-gray-800"
                >
                  <div
                    className={`absolute top-0 -left-[9px] h-4 w-4 rounded-full border-2 border-white transition-colors duration-300 dark:border-gray-900 ${
                      act.type === "APPROVED"
                        ? "bg-[#008C9D] shadow-[0_0_0_4px_rgba(0,140,157,0.2)] group-hover:bg-[#007A8A]"
                        : act.type === "WARNING"
                          ? "bg-[#CE2029] shadow-[0_0_0_4px_rgba(206,32,41,0.2)] group-hover:bg-[#B01B23]"
                          : "bg-[#F4B41A] shadow-[0_0_0_4px_rgba(244,180,26,0.2)] group-hover:bg-[#D49B15]"
                    }`}
                  />

                  <div className="mb-1 flex items-start justify-between gap-4">
                    <h4 className="text-sm leading-tight font-bold text-gray-900 dark:text-gray-100">
                      {act.title}
                    </h4>
                    <span className="shrink-0 rounded-full bg-gray-50 px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-gray-400 dark:bg-gray-800 dark:text-gray-500">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed wrap-break-word text-gray-500 dark:text-gray-400">
                    {act.desc}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400 dark:text-gray-600">
                <FileText className="mb-3 h-12 w-12 opacity-20" />
                <p>Belum ada aktivitas tercatat.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bento-item group col-span-1 flex h-full flex-col justify-between overflow-hidden rounded-4xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 transition-colors hover:border-[#008C9D]/30 md:col-span-1 md:rounded-[2.5rem] md:p-8 lg:col-span-2 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none dark:hover:border-[#008C9D]/50">
          <div className="mb-6 flex items-start justify-between">
            <div className="rounded-2xl bg-[#008C9D]/10 p-3 text-[#008C9D] transition-transform duration-300 group-hover:scale-110">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-2xl font-black text-gray-900 dark:text-white">
              Cari Kompen?
            </h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Temukan pekerjaan yang cocok dengan keahlianmu dan selesaikan
              kewajiban kompen.
            </p>
          </div>

          <Link
            href="/jobs"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] py-3 text-center font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A]"
          >
            Lihat Lowongan <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
