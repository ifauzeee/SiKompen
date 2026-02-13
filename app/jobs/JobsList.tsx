"use client";

import { useRef, useState, useEffect } from "react";
import { useDialog } from "@/contexts/DialogContext";
import {
  Clock,
  Users,
  UserCircle,
  Search,
  ArrowRight,
  Filter,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
} from "lucide-react";
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
  { value: "latest", label: "Terbaru" },
  { value: "hours_desc", label: "Jam Terbanyak" },
  { value: "hours_asc", label: "Jam Sedikit" },
];

const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "OPEN", label: "Tersedia" },
  { value: "CLOSED", label: "Penuh" },
];

const hoursRanges = [
  { value: "", label: "Semua Jam" },
  { value: "1-5", label: "1-5 Jam" },
  { value: "6-10", label: "6-10 Jam" },
  { value: "11-20", label: "11-20 Jam" },
  { value: "21+", label: "> 20 Jam" },
];

export default function JobsList({
  jobs,
  appliedJobIds = [],
  userRole,
  userTotalHours = 0,
}: {
  jobs: Job[];
  appliedJobIds?: number[];
  userRole?: string;
  userTotalHours?: number;
}) {
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

  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });
  const [confirmState, setConfirmState] = useState<{
    show: boolean;
    jobId: number | null;
  }>({ show: false, jobId: null });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(
        () => setToast((prev) => ({ ...prev, show: false })),
        3000,
      );
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ show: true, type, message });
  };

  const handleDelete = async (jobId: number) => {
    const confirmed = await showConfirm(
      "Apakah anda yakin ingin menghapus pekerjaan ini?",
      "Hapus Pekerjaan",
    );
    if (!confirmed) return;
    const res = await deleteJob(jobId);
    if (res?.success) {
      showToast("success", "Pekerjaan berhasil dihapus.");
    } else {
      showToast("error", "Gagal menghapus pekerjaan.");
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
      showToast("error", res.error);
    } else {
      showToast(
        "success",
        "Berhasil melamar pekerjaan! Silahkan tunggu konfirmasi dari pengawas.",
      );
    }
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !status || job.status === status;
      const matchesSupervisor =
        !selectedSupervisor || job.createdBy?.name === selectedSupervisor;

      let matchesHours = true;
      if (hoursRange) {
        switch (hoursRange) {
          case "1-5":
            matchesHours = job.hours >= 1 && job.hours <= 5;
            break;
          case "6-10":
            matchesHours = job.hours >= 6 && job.hours <= 10;
            break;
          case "11-20":
            matchesHours = job.hours >= 11 && job.hours <= 20;
            break;
          case "21+":
            matchesHours = job.hours > 20;
            break;
        }
      }

      return (
        matchesSearch && matchesStatus && matchesSupervisor && matchesHours
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "hours_desc":
          return b.hours - a.hours;
        case "hours_asc":
          return a.hours - b.hours;
        default:
          return b.id - a.id;
      }
    });

  const activeFiltersCount = [status, hoursRange, selectedSupervisor].filter(
    Boolean,
  ).length;

  const uniqueSupervisors = Array.from(
    new Set(jobs.map((job) => job.createdBy?.name).filter(Boolean)),
  ) as string[];

  const clearFilters = () => {
    setStatus("");
    setHoursRange("");
    setSelectedSupervisor("");
    setSortBy("latest");
  };

  return (
    <div
      ref={container}
      className="mx-auto min-h-screen max-w-[1600px] space-y-6 px-4 pt-8 pb-24 sm:px-8 md:space-y-8 md:pb-12"
    >
      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="w-full md:w-auto">
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-5xl">
            Katalog Pekerjaan
          </h1>
          <p className="text-base font-medium text-gray-500 dark:text-gray-400 md:text-lg">
            Temukan tugas kompen yang sesuai dengan keahlian anda.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 md:w-auto">
          <div className="group relative flex-1 md:flex-none">
            <input
              type="text"
              placeholder="Cari pekerjaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-lg shadow-gray-100 outline-none placeholder:text-gray-400 focus:border-[#008C9D] dark:border-white/5 dark:bg-[#0d1117] dark:text-white dark:shadow-none md:w-80 md:rounded-full md:px-6 md:py-4 md:text-base"
            />
            <Search className="absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#008C9D] md:h-5 md:w-5" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative rounded-xl p-3 transition-colors md:rounded-full md:p-4 ${showFilters || activeFiltersCount > 0 ? "bg-[#008C9D] text-white" : "border-2 border-gray-100 bg-white text-gray-600 dark:border-white/5 dark:bg-[#0d1117] dark:text-gray-400"}`}
          >
            <Filter size={20} />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#CE2029] text-xs font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {showFilters && (
        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-white/5 dark:bg-[#0d1117] md:p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">Filter Pekerjaan</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-medium text-[#CE2029] hover:text-[#B01B23]"
              >
                <X size={14} />
                Reset Filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Urutkan
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#008C9D] dark:border-white/5 dark:bg-slate-800 dark:text-white md:text-base"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#008C9D] dark:border-white/5 dark:bg-slate-800 dark:text-white md:text-base"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Jam Kompen
              </label>
              <select
                value={hoursRange}
                onChange={(e) => setHoursRange(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#008C9D] dark:border-white/5 dark:bg-slate-800 dark:text-white md:text-base"
              >
                {hoursRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500">
                Pengawas
              </label>
              <select
                value={selectedSupervisor}
                onChange={(e) => setSelectedSupervisor(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#008C9D] dark:border-white/5 dark:bg-slate-800 dark:text-white md:text-base"
              >
                <option value="">Semua Pengawas</option>
                {uniqueSupervisors.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">{filteredJobs.length}</span>{" "}
          dari {jobs.length} pekerjaan
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center md:py-20">
            <p className="text-lg font-bold text-gray-400 md:text-xl">
              Tidak ada pekerjaan yang sesuai filter.
            </p>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Coba ubah filter atau kata kunci pencarian.
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 rounded-xl bg-[#008C9D] px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-[#007A8A] md:text-base"
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
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-[#008C9D]/30 hover:shadow-xl dark:border-white/5 dark:bg-[#0d1117] dark:shadow-none md:rounded-3xl md:p-6"
              >
                <div
                  className={`absolute top-0 bottom-0 left-0 w-1.5 md:w-2 ${isOpen ? "bg-[#008C9D]" : "bg-[#CE2029]"}`}
                />

                <div className="relative z-10 flex flex-col gap-4 md:gap-6 lg:flex-row">
                  <div className="flex-1 space-y-3 pl-3 md:pl-4">
                    <div className="mb-1 flex flex-wrap items-center gap-2 md:gap-3">
                      <span
                        className={`text-[10px] font-bold md:text-xs ${isOpen ? "text-[#008C9D]" : "text-[#CE2029]"}`}
                      >
                        {isOpen ? "TERSEDIA" : "PENUH"}
                      </span>

                      {job.createdBy?.name && (
                        <div className="flex items-center gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-white/5 dark:text-gray-400 md:text-xs">
                          <UserCircle size={12} />
                          {job.createdBy.name}
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-[#008C9D] dark:text-white md:text-2xl">
                      {job.title}
                    </h3>

                    <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-gray-500 dark:text-gray-400 md:line-clamp-none md:text-base">
                      {job.description}
                    </p>

                    <div className="mt-2 flex max-w-lg flex-wrap gap-4 border-t border-gray-50 pt-4 dark:border-white/5 md:mt-4 md:gap-6">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-blue-50 p-1.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 md:p-2">
                          <Clock size={14} className="md:h-4 md:w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase dark:text-gray-500 md:text-xs">
                            Kompensasi
                          </p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white md:text-sm">
                            {job.hours} Jam
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-purple-50 p-1.5 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 md:p-2">
                          <Users size={14} className="md:h-4 md:w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase dark:text-gray-500 md:text-xs">
                            Sisa Kuota
                          </p>
                          <p className="text-xs font-bold text-gray-900 dark:text-white md:text-sm">
                            {job.quota} Mhs
                          </p>
                        </div>
                      </div>

                      {userRole === "MAHASISWA" && (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-50 p-1.5 text-green-600 dark:bg-green-500/10 dark:text-green-400 md:p-2">
                            <CheckCircle size={14} className="md:h-4 md:w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold tracking-tighter text-gray-400 uppercase dark:text-gray-500 md:text-xs">
                              Nilai Kompen
                            </p>
                            <p className="text-xs font-bold text-green-700 dark:text-green-400 md:text-sm">
                              -{job.hours} Jam (Rp{" "}
                              {(job.hours * 10000).toLocaleString("id-ID")})
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex w-full flex-row items-center justify-between gap-3 border-t border-dashed border-gray-100 pt-4 pl-0 lg:w-40 lg:flex-col lg:justify-center lg:border-t-0 lg:border-l lg:border-dashed lg:border-gray-200 lg:pt-0 lg:pl-8">
                    {["ADMIN", "PENGAWAS"].includes(userRole || "") ? (
                      <div className="flex w-full gap-2">
                        <button
                          onClick={() =>
                            router.push(`/dashboard/my-jobs/${job.id}/edit`)
                          }
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#008C9D]/10 py-2 text-sm font-bold text-[#008C9D] transition-colors hover:bg-[#008C9D]/20 md:py-3 md:text-base"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#CE2029]/10 py-2 text-sm font-bold text-[#CE2029] transition-colors hover:bg-[#CE2029]/20 md:py-3 md:text-base"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : appliedJobIds.includes(job.id) ? (
                      <div className="flex w-full flex-row items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 font-bold text-green-600 md:py-4 lg:flex-col">
                        <CheckCircle size={20} className="md:h-6 md:w-6" />
                        <span className="text-sm">Terkirim</span>
                      </div>
                    ) : userRole === "MAHASISWA" && userTotalHours <= 0 ? (
                      <div className="flex w-full flex-row items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 py-3 font-bold text-purple-600 md:py-4 lg:flex-col">
                        <CheckCircle size={20} className="md:h-6 md:w-6" />
                        <span className="text-sm">Bebas Kompen</span>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleApplyClick(job.id)}
                          disabled={!isOpen || applyingId === job.id}
                          className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-gray-200 transition-all duration-300 hover:bg-[#008C9D] hover:text-white hover:shadow-[#008C9D]/30 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:opacity-50 disabled:shadow-none dark:bg-slate-800 dark:shadow-none dark:hover:bg-[#008C9D] md:py-4 md:text-base"
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
                          ) : (
                            "Closed"
                          )}
                        </button>
                        <span className="hidden text-center text-[10px] font-bold tracking-wider text-gray-400 uppercase lg:block">
                          {isOpen
                            ? "Klik untuk melamar"
                            : "Pendaftaran ditutup"}
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
        <div className="fixed inset-0 z-9999 flex animate-[fadeIn_0.2s_ease-out] items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm scale-100 animate-[scaleIn_0.2s_ease-out] rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl md:p-8">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4B41A]/10">
              <AlertTriangle className="h-8 w-8 text-[#F4B41A]" />
            </div>
            <h3 className="mb-2 text-center text-xl font-black text-gray-900">
              Konfirmasi Lamaran
            </h3>
            <p className="mb-8 text-center text-sm text-gray-500">
              Apakah anda yakin ingin melamar pekerjaan ini? Pastikan anda
              memenuhi kualifikasi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmState({ show: false, jobId: null })}
                className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
              >
                Batal
              </button>
              <button
                onClick={confirmApply}
                className="flex-1 rounded-xl bg-[#008C9D] py-3 font-bold text-white transition-colors hover:bg-[#007A8A]"
              >
                Ya, Lamar
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        className={`fixed right-1/2 bottom-24 z-50 w-[90%] translate-x-1/2 transform transition-all duration-300 md:right-8 md:bottom-8 md:w-auto md:translate-x-0 ${toast.show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl md:px-6 md:py-4 ${toast.type === "success" ? "border-green-100 bg-white" : "border-red-100 bg-white"}`}
        >
          <div
            className={`shrink-0 rounded-full p-2 ${toast.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
          >
            {toast.type === "success" ? (
              <CheckCircle size={20} />
            ) : (
              <XCircle size={20} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4
              className={`text-sm font-bold ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}
            >
              {toast.type === "success" ? "Berhasil" : "Gagal"}
            </h4>
            <p className="truncate text-xs font-medium text-gray-500">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="ml-2 shrink-0 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {userRole === "MAHASISWA" &&
        appliedJobIds.length > 0 &&
        (() => {
          const totalAppliedHours = jobs
            .filter((job) => appliedJobIds.includes(job.id))
            .reduce((sum, job) => sum + job.hours, 0);

          const remainingHours = Math.max(
            0,
            userTotalHours - totalAppliedHours,
          );

          if (totalAppliedHours > 0) {
            return (
              <div className="animate-in slide-in-from-bottom-4 fixed right-4 bottom-6 left-4 z-40 flex justify-center duration-500 md:absolute md:right-auto md:bottom-8 md:left-1/2 md:w-auto md:-translate-x-1/2 lg:left-72 lg:translate-x-8">
                <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white shadow-2xl md:w-auto md:justify-start md:gap-4 md:rounded-full md:px-6 md:py-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className={`shrink-0 rounded-full p-2 ${remainingHours === 0 ? "bg-green-500" : "bg-[#008C9D]"}`}
                    >
                      {remainingHours === 0 ? (
                        <CheckCircle size={18} className="text-white" />
                      ) : (
                        <Clock size={18} className="text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase md:text-xs">
                        Estimasi Sisa
                      </p>
                      <p className="text-sm leading-none font-black text-white md:text-lg">
                        {remainingHours === 0 ? (
                          <span className="text-green-400">LUNAS</span>
                        ) : (
                          <>{remainingHours} Jam</>
                        )}
                      </p>
                    </div>
                  </div>
                  {remainingHours > 0 && (
                    <div className="text-right">
                      <span className="rounded-lg bg-[#008C9D]/10 px-2 py-1 text-xs font-bold text-[#008C9D] md:text-sm">
                        Rp {(remainingHours * 10000).toLocaleString("id-ID")}
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
