"use client";

import { useRef, useState, useEffect } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { Clock, Users, UserCircle, Search, ArrowRight, Filter, X, Loader2, AlertTriangle, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { applyForJob } from "@/app/actions/applications";
import { deleteJob } from "@/app/actions/jobs";
import { useRouter } from "next/navigation";

type Job = {
    id: number;
    title: string;
    description: string;
    quota: number;
    hours: number;
    status: string;
    category: string;
    createdBy?: { name: string | null } | null;
};

const sortOptions = [
    { value: 'latest', label: 'Terbaru' },
    { value: 'hours_desc', label: 'Jam Terbanyak' },
    { value: 'hours_asc', label: 'Jam Sedikit' },
];

const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'OPEN', label: 'Tersedia' },
    { value: 'CLOSED', label: 'Penuh' },
];

const hoursRanges = [
    { value: '', label: 'Semua Jam' },
    { value: '1-5', label: '1-5 Jam' },
    { value: '6-10', label: '6-10 Jam' },
    { value: '11-20', label: '11-20 Jam' },
    { value: '21+', label: '> 20 Jam' },
];

export default function JobsList({ jobs, appliedJobIds = [], userRole, userTotalHours = 0 }: { jobs: Job[], appliedJobIds?: number[], userRole?: string, userTotalHours?: number }) {
    const container = useRef(null);
    const router = useRouter();
    const { showConfirm } = useDialog();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [status, setStatus] = useState("");
    const [hoursRange, setHoursRange] = useState("");
    const [selectedSupervisor, setSelectedSupervisor] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [applyingId, setApplyingId] = useState<number | null>(null);

    const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({ show: false, type: 'success', message: '' });
    const [confirmState, setConfirmState] = useState<{ show: boolean, jobId: number | null }>({ show: false, jobId: null });

    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast.show]);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ show: true, type, message });
    };

    const handleDelete = async (jobId: number) => {
        const confirmed = await showConfirm("Apakah anda yakin ingin menghapus pekerjaan ini?", "Hapus Pekerjaan");
        if (!confirmed) return;
        const res = await deleteJob(jobId);
        if (res?.success) {
            showToast('success', "Pekerjaan berhasil dihapus.");
        } else {
            showToast('error', "Gagal menghapus pekerjaan.");
        }
    };

    const handleApplyClick = (jobId: number) => {
        setConfirmState({ show: true, jobId });
    };

    const confirmApply = async () => {
        if (!confirmState.jobId) return;

        const jobId = confirmState.jobId;
        setConfirmState({ show: false, jobId: null });
        setApplyingId(jobId);

        const res = await applyForJob(jobId);
        setApplyingId(null);

        if (res?.error) {
            showToast('error', res.error);
        } else {
            showToast('success', "Berhasil melamar pekerjaan! Silahkan tunggu konfirmasi dari pengawas.");
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !status || job.status === status;
        const matchesSupervisor = !selectedSupervisor || job.createdBy?.name === selectedSupervisor;

        let matchesHours = true;
        if (hoursRange) {
            switch (hoursRange) {
                case '1-5':
                    matchesHours = job.hours >= 1 && job.hours <= 5;
                    break;
                case '6-10':
                    matchesHours = job.hours >= 6 && job.hours <= 10;
                    break;
                case '11-20':
                    matchesHours = job.hours >= 11 && job.hours <= 20;
                    break;
                case '21+':
                    matchesHours = job.hours > 20;
                    break;
            }
        }

        return matchesSearch && matchesStatus && matchesSupervisor && matchesHours;
    }).sort((a, b) => {
        switch (sortBy) {
            case 'hours_desc':
                return b.hours - a.hours;
            case 'hours_asc':
                return a.hours - b.hours;
            default:
                return b.id - a.id;
        }
    });

    const activeFiltersCount = [status, hoursRange, selectedSupervisor].filter(Boolean).length;

    const uniqueSupervisors = Array.from(new Set(jobs.map(job => job.createdBy?.name).filter(Boolean))) as string[];

    const clearFilters = () => {
        setStatus("");
        setHoursRange("");
        setSelectedSupervisor("");
        setSortBy("latest");
    };

    return (
        <div ref={container} className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-24 md:pb-12 space-y-6 md:space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div className="w-full md:w-auto">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Katalog Pekerjaan</h1>
                    <p className="text-gray-500 text-base md:text-lg font-medium">Temukan tugas kompen yang sesuai dengan keahlian anda.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <input
                            type="text"
                            placeholder="Cari pekerjaan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-full bg-white border-2 border-gray-100 focus:border-[#008C9D] outline-none shadow-lg shadow-gray-100 transition-all font-medium text-gray-700 placeholder:text-gray-400 text-sm md:text-base"
                        />
                        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#008C9D] transition-colors w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-3 md:p-4 rounded-xl md:rounded-full transition-colors relative ${showFilters || activeFiltersCount > 0 ? 'bg-[#008C9D] text-white' : 'bg-white text-gray-600 border-2 border-gray-100'}`}
                    >
                        <Filter size={20} />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#CE2029] text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>
                </div>
            </header>

            {showFilters && (
                <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6 space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Filter Pekerjaan</h3>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm font-medium text-[#CE2029] hover:text-[#B01B23] flex items-center gap-1"
                            >
                                <X size={14} />
                                Reset Filter
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Urutkan</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#008C9D] outline-none text-sm md:text-base"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#008C9D] outline-none text-sm md:text-base"
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Jam Kompen</label>
                            <select
                                value={hoursRange}
                                onChange={(e) => setHoursRange(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#008C9D] outline-none text-sm md:text-base"
                            >
                                {hoursRanges.map(range => (
                                    <option key={range.value} value={range.value}>{range.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-2">Pengawas</label>
                            <select
                                value={selectedSupervisor}
                                onChange={(e) => setSelectedSupervisor(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#008C9D] outline-none text-sm md:text-base"
                            >
                                <option value="">Semua Pengawas</option>
                                {uniqueSupervisors.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm md:text-base">
                    Menampilkan <span className="font-bold text-gray-900">{filteredJobs.length}</span> dari {jobs.length} pekerjaan
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:gap-6">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 md:py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-lg md:text-xl font-bold text-gray-400">Tidak ada pekerjaan yang sesuai filter.</p>
                        <p className="text-gray-400 mt-2 text-sm md:text-base">Coba ubah filter atau kata kunci pencarian.</p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="mt-4 px-6 py-2 bg-[#008C9D] text-white rounded-xl font-bold hover:bg-[#007A8A] transition-colors text-sm md:text-base"
                            >
                                Reset Filter
                            </button>
                        )}
                    </div>
                ) : (
                    filteredJobs.map((job) => {
                        const isOpen = job.status === "OPEN";

                        return (
                            <article
                                key={job.id}
                                className="group relative bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#008C9D]/30 transition-all duration-300 overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 md:w-2 ${isOpen ? "bg-[#008C9D]" : "bg-[#CE2029]"}`} />

                                <div className="flex flex-col lg:flex-row gap-4 md:gap-6 relative z-10">
                                    <div className="flex-1 space-y-3 pl-3 md:pl-4">
                                        <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                                            <span className={`text-[10px] md:text-xs font-bold ${isOpen ? "text-[#008C9D]" : "text-[#CE2029]"}`}>
                                                {isOpen ? "TERSEDIA" : "PENUH"}
                                            </span>

                                            {job.createdBy?.name && (
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-full text-[10px] md:text-xs font-bold text-gray-500">
                                                    <UserCircle size={12} />
                                                    {job.createdBy.name}
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-[#008C9D] transition-colors">
                                            {job.title}
                                        </h3>

                                        <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none">
                                            {job.description}
                                        </p>

                                        <div className="flex flex-wrap gap-4 md:gap-6 mt-2 md:mt-4 pt-4 border-t border-gray-50 max-w-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 md:p-2 rounded-full bg-blue-50 text-blue-600">
                                                    <Clock size={14} className="md:w-4 md:h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tighter">Kompensasi</p>
                                                    <p className="text-xs md:text-sm font-bold text-gray-900">{job.hours} Jam</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 md:p-2 rounded-full bg-purple-50 text-purple-600">
                                                    <Users size={14} className="md:w-4 md:h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tighter">Sisa Kuota</p>
                                                    <p className="text-xs md:text-sm font-bold text-gray-900">{job.quota} Mhs</p>
                                                </div>
                                            </div>

                                            {userRole === 'MAHASISWA' && (
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 md:p-2 rounded-full bg-green-50 text-green-600">
                                                        <CheckCircle size={14} className="md:w-4 md:h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-tighter">Nilai Kompen</p>
                                                        <p className="text-xs md:text-sm font-bold text-green-700">
                                                            -{job.hours} Jam (Rp {(job.hours * 10000).toLocaleString('id-ID')})
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-40 flex flex-row lg:flex-col justify-between lg:justify-center items-center gap-3 lg:border-l lg:border-dashed lg:border-gray-200 pl-0 lg:pl-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-dashed border-gray-100">
                                        {['ADMIN', 'PENGAWAS'].includes(userRole || '') ? (
                                            <div className="flex gap-2 w-full">
                                                <button
                                                    onClick={() => router.push(`/dashboard/my-jobs/${job.id}/edit`)}
                                                    className="flex-1 py-2 md:py-3 rounded-xl font-bold text-[#008C9D] bg-[#008C9D]/10 hover:bg-[#008C9D]/20 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job.id)}
                                                    className="flex-1 py-2 md:py-3 rounded-xl font-bold text-[#CE2029] bg-[#CE2029]/10 hover:bg-[#CE2029]/20 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ) : appliedJobIds.includes(job.id) ? (
                                            <div className="w-full py-3 md:py-4 bg-green-50 text-green-600 rounded-xl font-bold flex flex-row lg:flex-col items-center justify-center gap-2 border border-green-200">
                                                <CheckCircle size={20} className="md:w-6 md:h-6" />
                                                <span className="text-sm">Terkirim</span>
                                            </div>
                                        ) : userRole === 'MAHASISWA' && userTotalHours <= 0 ? (
                                            <div className="w-full py-3 md:py-4 bg-purple-50 text-purple-600 rounded-xl font-bold flex flex-row lg:flex-col items-center justify-center gap-2 border border-purple-200">
                                                <CheckCircle size={20} className="md:w-6 md:h-6" />
                                                <span className="text-sm">Bebas Kompen</span>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleApplyClick(job.id)}
                                                    disabled={!isOpen || applyingId === job.id}
                                                    className="w-full py-3 md:py-4 px-6 rounded-xl font-bold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 bg-gray-900 text-white shadow-xl shadow-gray-200 hover:bg-[#008C9D] hover:text-white hover:shadow-[#008C9D]/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:shadow-none text-sm md:text-base"
                                                >
                                                    {applyingId === job.id ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={16} />
                                                            Apply...
                                                        </>
                                                    ) : isOpen ? (
                                                        <>
                                                            Apply <ArrowRight size={16} />
                                                        </>
                                                    ) : "Closed"}
                                                </button>
                                                <span className="hidden lg:block text-[10px] uppercase font-bold text-gray-400 tracking-wider text-center">
                                                    {isOpen ? "Klik untuk melamar" : "Pendaftaran ditutup"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>

            {confirmState.show && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl border border-gray-100 scale-100 animate-[scaleIn_0.2s_ease-out]">
                        <div className="w-16 h-16 bg-[#F4B41A]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                            <AlertTriangle className="w-8 h-8 text-[#F4B41A]" />
                        </div>
                        <h3 className="text-xl font-black text-center text-gray-900 mb-2">Konfirmasi Lamaran</h3>
                        <p className="text-gray-500 text-center text-sm mb-8">
                            Apakah anda yakin ingin melamar pekerjaan ini? Pastikan anda memenuhi kualifikasi.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmState({ show: false, jobId: null })}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmApply}
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#008C9D] hover:bg-[#007A8A] transition-colors"
                            >
                                Ya, Lamar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`fixed bottom-24 md:bottom-8 right-1/2 translate-x-1/2 md:right-8 md:translate-x-0 z-50 transform transition-all duration-300 w-[90%] md:w-auto ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
                <div className={`flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-xl border ${toast.type === 'success' ? 'bg-white border-green-100' : 'bg-white border-red-100'}`}>
                    <div className={`p-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className={`font-bold text-sm ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                            {toast.type === 'success' ? 'Berhasil' : 'Gagal'}
                        </h4>
                        <p className="text-xs text-gray-500 font-medium truncate">{toast.message}</p>
                    </div>
                    <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="text-gray-400 hover:text-gray-600 ml-2 shrink-0">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {userRole === 'MAHASISWA' && appliedJobIds.length > 0 && (() => {
                const totalAppliedHours = jobs
                    .filter(job => appliedJobIds.includes(job.id))
                    .reduce((sum, job) => sum + job.hours, 0);

                const remainingHours = Math.max(0, userTotalHours - totalAppliedHours);

                if (totalAppliedHours > 0) {
                    return (
                        <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:bottom-8 md:w-auto z-40 animate-in slide-in-from-bottom-4 duration-500 flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2 lg:left-72 lg:translate-x-8">
                            <div className="bg-gray-900 text-white px-4 py-3 md:px-6 md:py-4 rounded-2xl md:rounded-full shadow-2xl flex items-center gap-3 md:gap-4 border border-gray-800 w-full md:w-auto justify-between md:justify-start">
                                <div className="flex items-center gap-3 md:gap-4">
                                    <div className={`p-2 rounded-full shrink-0 ${remainingHours === 0 ? 'bg-green-500' : 'bg-[#008C9D]'}`}>
                                        {remainingHours === 0 ? <CheckCircle size={18} className="text-white" /> : <Clock size={18} className="text-white" />}
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
