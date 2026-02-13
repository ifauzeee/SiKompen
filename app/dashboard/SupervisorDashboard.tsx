"use client";

import Link from "next/link";
import {
  Briefcase,
  FileCheck,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import ApplicationList from "./ApplicationList";
import { User, JobApplication } from "@/types";

interface SupervisorDashboardProps {
  user: User;
  stats?: {
    myJobs: number;
    pendingValidations: number;
    verifyingCount: number;
  };
  applications?: (JobApplication & {
    user: { name: string; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
  })[];
  acceptedApplications?: (JobApplication & {
    user: { name: string; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
  })[];
  verifyingApplications?: (JobApplication & {
    user: { name: string; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
    proofImage1: string | null;
    proofImage2: string | null;
    submissionNote: string | null;
  })[];
}

export default function SupervisorDashboard({
  stats,
  applications,
  acceptedApplications,
  verifyingApplications,
}: SupervisorDashboardProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8 dark:bg-slate-950">
      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Portal Pengawas
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-lg">
            Kelola pekerjaan dan validasi mahasiswa Anda.
          </p>
        </div>

        <Link
          href="/jobs/create"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-6 py-3 text-sm font-bold text-white shadow-[#008C9D]/20 transition-all hover:bg-[#007A8A] hover:shadow-lg active:scale-95 md:w-auto md:text-base"
        >
          <PlusCircle size={20} />
          <span>Buat Lowongan Baru</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/dashboard/my-jobs"
          className="group flex h-full flex-col justify-between rounded-4xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:scale-[1.02] dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8"
        >
          <div className="mb-6 flex items-start justify-between">
            <div className="rounded-2xl bg-[#008C9D]/10 p-4 text-[#008C9D] transition-transform duration-300 group-hover:scale-110 dark:bg-[#008C9D]/20">
              <Briefcase size={28} />
            </div>
            <span className="flex items-center rounded-lg bg-[#008C9D]/10 px-3 py-1 text-xs font-bold text-[#008C9D] dark:bg-[#008C9D]/20">
              Kelola
            </span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Pekerjaan Saya
            </p>
            <h3 className="mt-2 text-4xl font-black text-gray-900 dark:text-white md:text-5xl">
              {stats?.myJobs || 0}
            </h3>
          </div>
        </Link>

        <div className="group flex h-full flex-col justify-between rounded-4xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:scale-[1.02] dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="rounded-2xl bg-[#F4B41A]/10 p-4 text-[#F4B41A] transition-transform duration-300 group-hover:scale-110">
              <FileCheck size={28} />
            </div>
            {stats?.pendingValidations ? (
              <span className="flex animate-pulse items-center rounded-lg bg-[#CE2029] px-3 py-1 text-xs font-bold text-white">
                {stats.pendingValidations} Baru
              </span>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Menunggu Validasi
            </p>
            <h3 className="mt-2 text-4xl font-black text-gray-900 dark:text-white md:text-5xl">
              {stats?.pendingValidations || 0}
            </h3>
          </div>
        </div>

        <div className="group flex h-full flex-col justify-between rounded-4xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:scale-[1.02] dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
          <div className="mb-6 flex items-start justify-between">
            <div className="rounded-2xl bg-purple-100 p-4 text-purple-600 transition-transform duration-300 group-hover:scale-110">
              <FileCheck size={28} />
            </div>
            {stats?.verifyingCount ? (
              <span className="flex animate-pulse items-center rounded-lg bg-purple-600 px-3 py-1 text-xs font-bold text-white">
                {stats.verifyingCount} Bukti
              </span>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Verifikasi Bukti
            </p>
            <h3 className="mt-2 text-4xl font-black text-gray-900 dark:text-white md:text-5xl">
              {stats?.verifyingCount || 0}
            </h3>
          </div>
        </div>

        <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-4xl bg-linear-to-br from-[#008C9D] to-[#007A8A] p-6 text-white shadow-xl shadow-[#008C9D]/20 md:rounded-[2.5rem] md:p-8">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10 blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="relative z-10">
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                <ShieldCheck size={28} />
              </div>
            </div>
            <div className="mt-8">
              <h3 className="mb-1 text-xl font-bold">Status Pengawas</h3>
              <p className="text-sm leading-relaxed text-blue-100">
                Akun Anda aktif dan dapat memposting pekerjaan.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                  Validasi Pelamar
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                  Setujui pelamar agar mereka dapat mulai bekerja.
                </p>
              </div>
              <span className="rounded-full bg-[#F4B41A]/10 px-4 py-1.5 text-xs font-bold text-[#F4B41A] md:text-sm">
                {applications?.length || 0} Request
              </span>
            </div>
            <ApplicationList
              applications={applications || []}
              variant="PENDING"
              title="Semua Tervalidasi!"
            />
          </div>

          <div className="rounded-4xl border border-purple-100 bg-white p-4 shadow-xl shadow-purple-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                  🔍 Verifikasi Bukti
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                  Cek bukti pengerjaan mahasiswa, lalu potong jam.
                </p>
              </div>
              <span className="rounded-full bg-purple-100 px-4 py-1.5 text-xs font-bold text-purple-700 md:text-sm">
                {verifyingApplications?.length || 0} Menunggu
              </span>
            </div>
            <ApplicationList
              applications={verifyingApplications || []}
              variant="VERIFYING"
              title="Semua Bukti Terverifikasi!"
            />
          </div>

          <div className="rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white md:text-2xl">
                  Pekerjaan Berjalan
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                  Mahasiswa yang sedang mengerjakan (belum kirim bukti).
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-4 py-1.5 text-xs font-bold text-green-700 md:text-sm">
                {acceptedApplications?.length || 0} Active
              </span>
            </div>
            <ApplicationList
              applications={acceptedApplications || []}
              variant="ACCEPTED"
              title="Tidak Ada Pekerjaan Aktif"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-4xl border border-gray-800 bg-gray-900 p-6 text-white shadow-xl md:rounded-[2.5rem] md:p-8">
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-linear-to-t from-[#008C9D]/20 to-transparent"></div>
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/5 blur-3xl"></div>

            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-white/10 p-2">
                  <TrendingUp size={20} className="text-[#008C9D]" />
                </div>
                <h3 className="text-xl font-bold">Tips Pengawas</h3>
              </div>

              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#008C9D]/30 bg-[#008C9D]/20 text-sm font-black text-[#008C9D]">
                    1
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-gray-300">
                    Pastikan mahasiswa telah mengumpulkan bukti pengerjaan
                    sebelum validasi.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#008C9D]/30 bg-[#008C9D]/20 text-sm font-black text-[#008C9D]">
                    2
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-gray-300">
                    Berikan deskripsi pekerjaan yang jelas agar mahasiswa paham.
                  </p>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#008C9D]/30 bg-[#008C9D]/20 text-sm font-black text-[#008C9D]">
                    3
                  </div>
                  <p className="pt-1 text-sm leading-relaxed text-gray-300">
                    Hubungi admin jika terjadi kesalahan input jam kompen.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
