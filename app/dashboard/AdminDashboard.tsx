"use client";

import Link from "next/link";
import {
  Briefcase,
  FileCheck,
  PlusCircle,
  AlertTriangle,
  Settings,
  FileUp,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import ApplicationList from "./ApplicationList";
import { User, JobApplication } from "@/types";

interface AdminDashboardProps {
  user: User;
  stats?: {
    totalStudents: number;
    activeJobs: number;
    pendingValidations: number;
    totalIncome: number;
  };
  applications?: (JobApplication & {
    user: { name: string; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
  })[];
  acceptedApplications?: (JobApplication & {
    user: { name: string; nim: string | null; totalHours: number };
    job: { title: string; hours: number };
  })[];
  topDebtors?: { name: string; nim: string | null; totalHours: number }[];
}

export default function AdminDashboard({
  user: _user,
  stats,
  applications,
  acceptedApplications,
  topDebtors,
}: AdminDashboardProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <header className="mb-4 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
            Admin Portal
          </h1>
          <p className="text-sm font-medium text-gray-500 md:text-lg">
            Monitoring & Manajemen Kompensasi Pusat
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
          <Link
            href="/dashboard/finance"
            className="flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white transition-all hover:shadow-lg active:scale-95 md:text-base"
          >
            <TrendingUp size={18} />
            <span>Finance Portal</span>
          </Link>
          <Link
            href="/jobs/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-4 py-2.5 text-sm font-bold text-white shadow-[#008C9D]/20 transition-all hover:bg-[#007A8A] hover:shadow-lg active:scale-95 md:text-base"
          >
            <PlusCircle size={18} />
            <span>Buat Pekerjaan</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition-all hover:bg-gray-50 hover:shadow-lg active:scale-95 md:text-base"
          >
            <Settings size={18} />
            <span>Pengaturan</span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <div className="group flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-green-500/30 md:rounded-[2.5rem] md:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-green-100 p-3 text-green-600 transition-transform duration-300 group-hover:scale-110">
              <TrendingUp size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Total Pemasukan
            </p>
            <h3 className="mt-1 text-2xl font-black text-gray-900">
              Rp {stats?.totalIncome.toLocaleString("id-ID") || 0}
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-[#008C9D]/30 md:rounded-[2.5rem] md:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-[#008C9D]/10 p-3 text-[#008C9D] transition-transform duration-300 group-hover:scale-110">
              <Users size={24} />
            </div>
            <span className="flex items-center rounded-lg bg-[#008C9D]/10 px-2 py-1 text-xs font-bold text-[#008C9D]">
              <TrendingUp size={12} className="mr-1" /> +12%
            </span>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Total Mahasiswa
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 md:text-4xl">
              {stats?.totalStudents || 0}
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-[#CE2029]/30 md:rounded-[2.5rem] md:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-[#CE2029]/10 p-3 text-[#CE2029] transition-transform duration-300 group-hover:scale-110">
              <Briefcase size={24} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Pekerjaan Aktif
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 md:text-4xl">
              {stats?.activeJobs || 0}
            </h3>
          </div>
        </div>

        <div className="group flex flex-col justify-between rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 transition-all duration-300 hover:border-[#F4B41A]/30 md:rounded-[2.5rem] md:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-2xl bg-[#F4B41A]/10 p-3 text-[#F4B41A] transition-transform duration-300 group-hover:scale-110">
              <FileCheck size={24} />
            </div>
            {stats?.pendingValidations ? (
              <span className="flex animate-pulse items-center rounded-lg bg-[#CE2029]/10 px-2 py-1 text-xs font-bold text-[#CE2029]">
                Action Needed
              </span>
            ) : null}
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Perlu Validasi
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 md:text-4xl">
              {stats?.pendingValidations || 0}
            </h3>
          </div>
        </div>

        <div className="group relative hidden overflow-hidden rounded-[2.5rem] border border-[#007A8A] bg-[#008C9D] p-6 text-white shadow-xl"></div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                  Permintaan Validasi
                </h3>
                <p className="text-xs text-gray-500 md:text-sm">
                  Validasi pekerjaan yang baru dilamar mahasiswa.
                </p>
              </div>
              <span className="rounded-full bg-[#008C9D]/10 px-4 py-1.5 text-xs font-bold text-[#008C9D] md:text-sm">
                {applications?.length || 0} Pending
              </span>
            </div>
            <ApplicationList
              applications={applications || []}
              variant="PENDING"
              title="Semua Tervalidasi!"
            />
          </div>

          <div className="rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:mb-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                  Pekerjaan Berjalan
                </h3>
                <p className="text-xs text-gray-500 md:text-sm">
                  Monitor dan selesaikan pekerjaan yang sedang dikerjakan.
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

        <div className="flex flex-col gap-8">
          <div className="flex-1 rounded-4xl border border-gray-100 bg-white p-4 shadow-xl shadow-gray-100/50 md:rounded-[2.5rem] md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 md:text-xl">
                <AlertTriangle className="text-[#CE2029]" size={20} />
                Top Hutang
              </h3>
              <Link
                href="/dashboard/users?filter=debt"
                className="text-xs font-bold text-[#008C9D] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400">
                  <tr>
                    <th className="p-3 text-xs font-bold tracking-wider uppercase md:p-4">
                      Mhs
                    </th>
                    <th className="p-3 text-right text-xs font-bold tracking-wider uppercase md:p-4">
                      Jam
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topDebtors && topDebtors.length > 0 ? (
                    topDebtors.map((mhs, idx) => (
                      <tr
                        key={idx}
                        className="group cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <td className="p-3 md:p-4">
                          <p className="text-xs font-bold text-gray-900 md:text-sm">
                            {mhs.name}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 md:text-xs">
                            {mhs.nim}
                          </p>
                        </td>
                        <td className="p-3 text-right md:p-4">
                          <span className="rounded-lg bg-[#CE2029]/10 px-2 py-1 text-xs font-black text-[#CE2029] tabular-nums md:text-sm">
                            {mhs.totalHours}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={2}
                        className="p-8 text-center text-sm text-gray-400"
                      >
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-4xl border border-[#007A8A] bg-[#008C9D] p-6 text-white shadow-xl md:rounded-[2.5rem] md:p-8">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-white/10 blur-[80px]"></div>
            <h3 className="relative z-10 mb-6 text-lg font-bold md:text-xl">
              Menu Cepat
            </h3>
            <div className="relative z-10 space-y-3">
              <QuickLink
                href="/dashboard/users"
                icon={<Users size={18} />}
                label="Kelola Pengguna"
              />
              <QuickLink
                href="/dashboard/finance"
                icon={<TrendingUp size={18} />}
                label="Finance Dashboard"
              />
              <QuickLink
                href="/dashboard/import"
                icon={<FileUp size={18} />}
                label="Import Data Mhs"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 p-4 transition-all hover:bg-white/20 active:scale-95"
    >
      <div className="flex items-center gap-3 text-white">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight
        size={16}
        className="text-white/70 transition-colors group-hover:text-white"
      />
    </Link>
  );
}
