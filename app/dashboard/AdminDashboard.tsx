"use client";

import Link from "next/link";
import {
    Users,
    Briefcase,
    FileCheck,
    PlusCircle,
    AlertTriangle,
    Clock,
    Settings,
    FileUp,
    Download,
    ChevronRight,
    FileText,
    TrendingUp,
    Search
} from "lucide-react";
import ApplicationList from "./ApplicationList";
import { User, JobApplication } from "@prisma/client";

interface AdminDashboardProps {
    user: User;
    stats?: {
        totalStudents: number;
        activeJobs: number;
        pendingValidations: number;
    };
    applications?: (JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number } })[];
    acceptedApplications?: (JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number } })[];
    topDebtors?: { name: string; nim: string | null; totalHours: number }[];
}

export default function AdminDashboard({ user, stats, applications, acceptedApplications, topDebtors }: AdminDashboardProps) {

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Monitoring & Manajemen Kompensasi Pusat
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                        <Download size={18} />
                        <span>Export Data</span>
                    </button>
                    <Link href="/jobs/create" className="flex items-center gap-2 px-4 py-2.5 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] hover:shadow-lg shadow-[#008C9D]/20 transition-all active:scale-95">
                        <PlusCircle size={18} />
                        <span>Buat Pekerjaan</span>
                    </Link>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#008C9D]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#008C9D]/10 text-[#008C9D] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Users size={24} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-[#008C9D] bg-[#008C9D]/10 px-2 py-1 rounded-lg">
                            <TrendingUp size={12} className="mr-1" /> +12%
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Total Mahasiswa</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{stats?.totalStudents || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#CE2029]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#CE2029]/10 text-[#CE2029] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Briefcase size={24} />
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Pekerjaan Aktif</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{stats?.activeJobs || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#F4B41A]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-[#F4B41A]/10 text-[#F4B41A] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FileCheck size={24} />
                        </div>
                        {stats?.pendingValidations ? (
                            <span className="flex items-center text-xs font-bold text-[#CE2029] bg-[#CE2029]/10 px-2 py-1 rounded-lg animate-pulse">
                                Action Needed
                            </span>
                        ) : null}
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Perlu Validasi</p>
                        <h3 className="text-4xl font-black text-gray-900 mt-1">{stats?.pendingValidations || 0}</h3>
                    </div>
                </div>

                <div className="bg-[#008C9D] text-white p-6 rounded-[2.5rem] border border-[#007A8A] shadow-xl flex flex-col justify-between group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md text-white">
                                <Settings size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-white/70 font-bold text-xs uppercase tracking-wider">System Status</p>
                            <h3 className="text-lg font-bold mt-1 text-white flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#34d399] animate-pulse"></span>
                                Operational
                            </h3>
                        </div>
                    </div>
                    <Link href="/dashboard/settings" className="relative z-10 text-xs font-bold text-white/50 hover:text-white flex items-center gap-1 mt-4 transition-colors">
                        Pengaturan Lanjut <ChevronRight size={14} />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Permintaan Validasi Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Permintaan Validasi</h3>
                                <p className="text-gray-500 text-sm">Validasi pekerjaan yang baru dilamar mahasiswa.</p>
                            </div>
                            <span className="bg-[#008C9D]/10 text-[#008C9D] px-4 py-1.5 rounded-full text-sm font-bold">
                                {applications?.length || 0} Pending
                            </span>
                        </div>
                        <ApplicationList applications={applications || []} variant="PENDING" title="Semua Tervalidasi!" />
                    </div>

                    {/* Pekerjaan Berjalan Section */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Pekerjaan Berjalan</h3>
                                <p className="text-gray-500 text-sm">Monitor dan selesaikan pekerjaan yang sedang dikerjakan.</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                {acceptedApplications?.length || 0} Active
                            </span>
                        </div>
                        <ApplicationList applications={acceptedApplications || []} variant="ACCEPTED" title="Tidak Ada Pekerjaan Aktif" />
                    </div>
                </div>

                <div className="flex flex-col gap-8">

                    <div className="flex-1 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="text-[#CE2029]" size={20} />
                                Top Hutang
                            </h3>
                            <Link href="/dashboard/users?filter=debt" className="text-xs font-bold text-[#008C9D] hover:underline">Lihat Semua</Link>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-gray-100">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-400">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider">Mhs</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-right">Jam</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {topDebtors && topDebtors.length > 0 ? topDebtors.map((mhs, idx) => (
                                        <tr key={idx} className="group hover:bg-gray-50 transition-colors cursor-pointer">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900 text-sm">{mhs.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">{mhs.nim}</p>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="font-black text-[#CE2029] bg-[#CE2029]/10 px-2 py-1 rounded-lg tabular-nums">
                                                    {mhs.totalHours}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={2} className="p-8 text-center text-gray-400 text-sm">Tidak ada data.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-[#008C9D] rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden text-white border border-[#007A8A]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
                        <h3 className="text-xl font-bold mb-6 relative z-10">Menu Cepat</h3>
                        <div className="space-y-3 relative z-10">
                            <QuickLink href="/dashboard/users" icon={<Users size={18} />} label="Kelola Pengguna" />
                            <QuickLink href="/dashboard/report" icon={<FileText size={18} />} label="Laporan Semester" />
                            <QuickLink href="/dashboard/import" icon={<FileUp size={18} />} label="Import Data Mhs" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all border border-white/10 group active:scale-95">
            <div className="flex items-center gap-3 text-white">
                {icon}
                <span className="font-medium text-sm">{label}</span>
            </div>
            <ChevronRight size={16} className="text-white/70 group-hover:text-white transition-colors" />
        </Link>
    );
}


