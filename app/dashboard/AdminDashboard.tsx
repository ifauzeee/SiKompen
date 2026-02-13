"use client";

import Link from "next/link";
import {
  Briefcase,
  FileText,
  PlusCircle,
  AlertTriangle,
  Settings,
  FileUp,
  ChevronRight,
  TrendingUp,
  Users,
} from "lucide-react";
import ApplicationList from "./ApplicationList";
import TrendChart from "@/components/TrendChart";
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
  trendData?: { month: string; hours: number }[];
}

export default function AdminDashboard({
  stats,
  applications,
  acceptedApplications,
  topDebtors,
  trendData,
}: AdminDashboardProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 transition-colors duration-300 sm:px-8 dark:bg-slate-950">
      <header className="mb-4 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Admin Portal
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 md:text-lg">
            Monitoring & Manajemen Kompensasi Pusat
          </p>
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto">
          <Link
            href="/dashboard/finance"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-50 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <TrendingUp size={18} />
            <span>Finance Portal</span>
          </Link>
          <Link
            href="/jobs/create"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-6 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,140,157,0.3)] transition-all hover:bg-[#007A8A] active:scale-95 md:text-base"
          >
            <PlusCircle size={18} />
            <span>Buat Pekerjaan</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95 md:text-base"
          >
            <Settings size={18} />
            <span>Pengaturan</span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Content (Left & Center) */}
        <div className="space-y-8 lg:col-span-9">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={<TrendingUp size={24} />}
              label="Total Pemasukan"
              value={`Rp ${stats?.totalIncome?.toLocaleString("id-ID") || 0}`}
              color="text-green-600"
              bgColor="bg-green-100 dark:bg-green-500/10"
              glowColor="shadow-green-500/5 hover:shadow-green-500/20"
              trend="+12%"
            />
            <StatCard
              icon={<Users size={24} />}
              label="Total Mahasiswa"
              value={stats?.totalStudents || 0}
              color="text-blue-500"
              bgColor="bg-blue-500/10"
              glowColor="shadow-blue-500/20"
              trend="+12%"
            />
            <StatCard
              icon={<Briefcase size={24} />}
              label="Pekerjaan Aktif"
              value={stats?.activeJobs || 0}
              color="text-orange-600"
              bgColor="bg-orange-100 dark:bg-orange-500/10"
              glowColor="shadow-orange-500/5 hover:shadow-orange-500/20"
            />
            <StatCard
              icon={<FileText size={24} />}
              label="Perlu Validasi"
              value={stats?.pendingValidations || 0}
              color="text-purple-600"
              bgColor="bg-purple-100 dark:bg-purple-500/10"
              glowColor="shadow-purple-500/5 hover:shadow-purple-500/20"
            />
          </div>

          {/* Chart Area */}
          <div className="rounded-[2.5rem] border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:p-8">
            {trendData && trendData.length > 0 && (
              <TrendChart
                data={trendData}
                color="#008C9D"
                title=""
              />
            )}
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Permintaan Validasi */}
            <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Permintaan Validasi
                  </h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Validasi pekerjaan yang baru dilamar mahasiswa.
                  </p>
                </div>
                <span className="rounded-full bg-[#008C9D]/10 px-3 py-1 text-xs font-bold text-[#008C9D]">
                  {applications?.length || 0} Pending
                </span>
              </div>
              <ApplicationList
                applications={applications || []}
                variant="PENDING"
                title="Semua Tervalidasi!"
              />
            </div>

            {/* Pekerjaan Berjalan */}
            <div className="rounded-[2.5rem] border border-gray-200 bg-white p-8 shadow-xl dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Pekerjaan Berjalan
                  </h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Monitor dan selesaikan pekerjaan yang sedang berjalan.
                  </p>
                </div>
                <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600">
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
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8 lg:col-span-3">
          {/* Top Hutang */}
          <div className="rounded-[2.5rem] border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 dark:text-white">
                <AlertTriangle className="text-red-500" size={18} />
                Top Hutang
              </h3>
              <Link
                href="/dashboard/users"
                className="text-xs font-bold text-[#008C9D] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-1">
              <table className="w-full">
                <thead className="text-left text-[10px] font-bold tracking-wider text-gray-300 uppercase">
                  <tr>
                    <th className="pb-3 pl-2">Mhs</th>
                    <th className="pb-3 text-right pr-2">Jam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                  {topDebtors && topDebtors.length > 0 ? (
                    topDebtors.map((mhs, idx) => (
                      <tr key={idx} className="group transition-colors hover:bg-gray-50 dark:hover:bg-white/5">
                        <td className="py-3 pl-2">
                          <p className="text-[13px] font-bold text-gray-900 transition-colors group-hover:text-[#008C9D] dark:text-gray-100">{mhs.name}</p>
                          <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 italic">Mhs</p>
                        </td>
                        <td className="py-3 text-right pr-2 font-black text-gray-900 text-sm dark:text-white">
                          {mhs.totalHours}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-xs text-gray-400">
                        Tidak ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Menu Cepat */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-[#008C9D]/50 bg-[#008C9D] p-8 text-white shadow-[0_20px_40px_rgba(0,140,157,0.2)]">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
            <h3 className="relative z-10 mb-6 text-xl font-bold">
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bgColor: string;
  glowColor: string;
  trend?: string;
}

function StatCard({
  icon,
  label,
  value,
  color,
  bgColor,
  glowColor,
  trend,
}: StatCardProps) {
  return (
    <div className={`group flex flex-col justify-between rounded-4xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 transition-all duration-300 hover:scale-[1.02] dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none ${glowColor}`}>
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-xl ${bgColor} p-3 ${color} transition-transform duration-300 group-hover:scale-110`}>
          {icon}
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-green-500 dark:text-green-400">
            <TrendingUp size={12} />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
          {label}
        </p>
        <h3 className="mt-1 text-2xl font-black text-gray-900 dark:text-white">
          {value}
        </h3>
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
      className="group flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/20 active:scale-95"
    >
      <div className="flex items-center gap-3">
        <div className="text-white/80 transition-colors group-hover:text-white">
          {icon}
        </div>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <ChevronRight
        size={16}
        className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white"
      />
    </Link>
  );
}
