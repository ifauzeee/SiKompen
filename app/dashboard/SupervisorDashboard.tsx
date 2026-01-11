"use client";

import Link from "next/link";
import {
    Briefcase,
    FileCheck,
    PlusCircle,
    TrendingUp,
    ShieldCheck
} from "lucide-react";
import ApplicationList from "./ApplicationList";
import { User, JobApplication } from "@prisma/client";

interface SupervisorDashboardProps {
    user: User;
    stats?: {
        myJobs: number;
        pendingValidations: number;
        verifyingCount: number;
    };
    applications?: (JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number } })[];
    acceptedApplications?: (JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number } })[];
    verifyingApplications?: (JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number }; proofImage1: string | null; proofImage2: string | null; submissionNote: string | null })[];
}

export default function SupervisorDashboard({ user: _user, stats, applications, acceptedApplications, verifyingApplications }: SupervisorDashboardProps) {

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Portal Pengawas
                    </h1>
                    <p className="text-gray-500 text-sm md:text-lg font-medium">
                        Kelola pekerjaan dan validasi mahasiswa Anda.
                    </p>
                </div>

                <Link href="/jobs/create" className="flex items-center justify-center gap-2 px-6 py-3 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] hover:shadow-lg shadow-[#008C9D]/20 transition-all active:scale-95 text-sm md:text-base w-full md:w-auto">
                    <PlusCircle size={20} />
                    <span>Buat Lowongan Baru</span>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link href="/dashboard/my-jobs" className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#008C9D]/30 transition-all duration-300 h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-[#008C9D]/10 text-[#008C9D] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <Briefcase size={28} />
                        </div>
                        <span className="flex items-center text-xs font-bold text-[#008C9D] bg-[#008C9D]/10 px-3 py-1 rounded-lg">
                            Kelola
                        </span>
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Pekerjaan Saya</p>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">{stats?.myJobs || 0}</h3>
                    </div>
                </Link>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-[#F4B41A]/30 transition-all duration-300 h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-[#F4B41A]/10 text-[#F4B41A] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FileCheck size={28} />
                        </div>
                        {stats?.pendingValidations ? (
                            <span className="flex items-center text-xs font-bold text-white bg-[#CE2029] px-3 py-1 rounded-lg animate-pulse">
                                {stats.pendingValidations} Baru
                            </span>
                        ) : null}
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Menunggu Validasi</p>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">{stats?.pendingValidations || 0}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col justify-between group hover:border-purple-300 transition-all duration-300 h-full">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                            <FileCheck size={28} />
                        </div>
                        {stats?.verifyingCount ? (
                            <span className="flex items-center text-xs font-bold text-white bg-purple-600 px-3 py-1 rounded-lg animate-pulse">
                                {stats.verifyingCount} Bukti
                            </span>
                        ) : null}
                    </div>
                    <div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-wider">Verifikasi Bukti</p>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">{stats?.verifyingCount || 0}</h3>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#008C9D] to-[#007A8A] text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl shadow-[#008C9D]/20 flex flex-col justify-between group relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                                <ShieldCheck size={28} />
                            </div>
                        </div>
                        <div className="mt-8">
                            <h3 className="text-xl font-bold mb-1">Status Pengawas</h3>
                            <p className="text-blue-100 text-sm leading-relaxed">Akun Anda aktif dan dapat memposting pekerjaan.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Validasi Pelamar</h3>
                                <p className="text-gray-500 text-xs md:text-sm mt-1">Setujui pelamar agar mereka dapat mulai bekerja.</p>
                            </div>
                            <span className="bg-[#F4B41A]/10 text-[#F4B41A] px-4 py-1.5 rounded-full text-xs md:text-sm font-bold">
                                {applications?.length || 0} Request
                            </span>
                        </div>
                        <ApplicationList applications={applications || []} variant="PENDING" title="Semua Tervalidasi!" />
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-purple-100 shadow-xl shadow-purple-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900">🔍 Verifikasi Bukti</h3>
                                <p className="text-gray-500 text-xs md:text-sm mt-1">Cek bukti pengerjaan mahasiswa, lalu potong jam.</p>
                            </div>
                            <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold">
                                {verifyingApplications?.length || 0} Menunggu
                            </span>
                        </div>
                        <ApplicationList applications={verifyingApplications || []} variant="VERIFYING" title="Semua Bukti Terverifikasi!" />
                    </div>

                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-4 md:p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900">Pekerjaan Berjalan</h3>
                                <p className="text-gray-500 text-xs md:text-sm">Mahasiswa yang sedang mengerjakan (belum kirim bukti).</p>
                            </div>
                            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold">
                                {acceptedApplications?.length || 0} Active
                            </span>
                        </div>
                        <ApplicationList applications={acceptedApplications || []} variant="ACCEPTED" title="Tidak Ada Pekerjaan Aktif" />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-xl text-white relative overflow-hidden border border-gray-800">
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#008C9D]/20 to-transparent"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-xl">
                                    <TrendingUp size={20} className="text-[#008C9D]" />
                                </div>
                                <h3 className="text-xl font-bold">Tips Pengawas</h3>
                            </div>

                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#008C9D]/20 flex items-center justify-center text-[#008C9D] font-black text-sm flex-shrink-0 border border-[#008C9D]/30">1</div>
                                    <p className="text-sm text-gray-300 leading-relaxed pt-1">Pastikan mahasiswa telah mengumpulkan bukti pengerjaan sebelum validasi.</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#008C9D]/20 flex items-center justify-center text-[#008C9D] font-black text-sm flex-shrink-0 border border-[#008C9D]/30">2</div>
                                    <p className="text-sm text-gray-300 leading-relaxed pt-1">Berikan deskripsi pekerjaan yang jelas agar mahasiswa paham.</p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-[#008C9D]/20 flex items-center justify-center text-[#008C9D] font-black text-sm flex-shrink-0 border border-[#008C9D]/30">3</div>
                                    <p className="text-sm text-gray-300 leading-relaxed pt-1">Hubungi admin jika terjadi kesalahan input jam kompen.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
