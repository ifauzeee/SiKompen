"use client";
import {
  Check,
  X,
  Clock,
  FileCheck,
  Play,
  Eye,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { updateApplicationStatus } from "@/app/actions/applications";
import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";

type Application = {
  id: number;
  user: { name: string | null; nim: string | null; totalHours: number };
  job: { title: string; hours: number };
  appliedAt: string;
  proofImage1?: string | null;
  proofImage2?: string | null;
  submissionNote?: string | null;
};

interface ApplicationListProps {
  applications: Application[];
  variant: "PENDING" | "ACCEPTED" | "VERIFYING";
  title?: string;
}

export default function ApplicationList({
  applications,
  variant,
  title,
}: ApplicationListProps) {
  const { showAlert, showConfirm } = useDialog();
  const [optimisticApps, setOptimisticApps] = useState(applications);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  async function handleAction(
    id: number,
    action: "ACCEPT" | "REJECT" | "COMPLETE",
  ) {
    const originalApps = [...optimisticApps];

    if (action === "COMPLETE") {
      const app = optimisticApps.find((a) => a.id === id);

      if (!app?.proofImage1) {
        showAlert(
          "Mahasiswa belum mengunggah bukti pengerjaan. Pekerjaan tidak dapat diselesaikan.",
          "Bukti Belum Ada",
        );
        return;
      }

      const confirmed = await showConfirm(
        `Verifikasi selesai untuk ${app?.user.name}?\n\nJam kompen mahasiswa akan dikurangi ${app?.job.hours} jam.`,
        "Konfirmasi Verifikasi",
      );
      if (!confirmed) return;
    }

    setOptimisticApps((prev) => prev.filter((app) => app.id !== id));

    let status: "ACCEPTED" | "REJECTED" | "COMPLETED";
    if (action === "ACCEPT") status = "ACCEPTED";
    else if (action === "REJECT") status = "REJECTED";
    else status = "COMPLETED";

    const res = await updateApplicationStatus(id, status);
    if (res?.error) {
      showAlert(res.error, "Gagal Memproses");
      setOptimisticApps(originalApps);
    }
  }

  if (optimisticApps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-4xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-12 text-center md:rounded-[2.5rem] dark:border-white/5 dark:bg-white/5">
        <div className="mb-4 flex h-16 w-16 rotate-3 transform items-center justify-center rounded-4xl bg-white shadow-xl shadow-gray-100 transition-transform duration-300 hover:rotate-6 dark:bg-gray-800 dark:shadow-black/50">
          <FileCheck size={32} className="text-[#008C9D]" />
        </div>
        <h3 className="mb-1 text-lg font-black text-gray-900 dark:text-white">
          {title || "Semua Beres!"}
        </h3>
        <p className="mx-auto max-w-xs px-4 text-sm text-gray-500 dark:text-gray-400">
          {variant === "PENDING"
            ? "Tidak ada permintaan validasi yang perlu diproses."
            : variant === "VERIFYING"
              ? "Tidak ada bukti pengerjaan yang perlu diverifikasi."
              : "Tidak ada pekerjaan yang sedang berjalan."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {optimisticApps.map((app) => {
        const isExpanded = expandedId === app.id;

        return (
          <div
            key={app.id}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:border-[#008C9D]/30 hover:shadow-xl hover:shadow-[#008C9D]/5 dark:border-white/5 dark:bg-[#0d1117] dark:hover:border-[#008C9D]/50"
          >
            <div
              className={`absolute top-0 bottom-0 left-0 w-1 ${variant === "VERIFYING" ? "bg-purple-500" : "bg-[#008C9D]"
                } rounded-r-full`}
            />

            <div className="flex flex-col justify-between gap-4 p-4 md:gap-6 md:p-5 lg:flex-row lg:items-center">
              <div className="flex-1 pl-2 lg:pl-0">
                <div className="mb-3 flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg ${variant === "VERIFYING"
                      ? "bg-linear-to-br from-purple-500 to-purple-700 shadow-purple-500/20"
                      : "bg-linear-to-br from-[#008C9D] to-[#007A8A] shadow-[#008C9D]/20"
                      }`}
                  >
                    {app.user.name
                      ? app.user.name.charAt(0).toUpperCase()
                      : "M"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="line-clamp-1 font-bold wrap-break-word text-gray-900 transition-colors group-hover:text-[#008C9D] dark:text-white">
                      {app.user.name || "Mahasiswa"}
                    </h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="rounded-lg border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                        {app.user.nim}
                      </span>
                      <span className="rounded-lg border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-bold whitespace-nowrap text-[#CE2029] dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                        {app.user.totalHours} Jam Utang
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pl-0 md:pl-14">
                  <p className="mb-2 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {variant === "PENDING"
                      ? "Melamar untuk: "
                      : variant === "VERIFYING"
                        ? "Mengirim bukti: "
                        : "Sedang mengerjakan: "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {app.job.title}
                    </span>
                    <span className="ml-2 font-bold text-[#008C9D]">
                      ({app.job.hours} Jam)
                    </span>
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-400">
                    <span className="flex items-center gap-1.5 rounded-md bg-gray-50 px-2 py-1 whitespace-nowrap dark:bg-gray-800 dark:text-gray-400">
                      <Clock size={12} className="text-[#008C9D]" />
                      {new Date(app.appliedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {app.proofImage1 && (
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : app.id)
                        }
                        className="flex items-center gap-1.5 rounded-md bg-purple-50 px-2 py-1 whitespace-nowrap text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
                      >
                        <ImageIcon size={12} />
                        Lihat Bukti
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex w-full items-center gap-3 pl-0 lg:mt-0 lg:w-auto lg:border-l lg:border-gray-200 lg:pl-6 dark:border-gray-800">
                {variant === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleAction(app.id, "REJECT")}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-transparent bg-gray-50 text-gray-400 transition-all hover:scale-105 hover:border-red-100 hover:bg-red-50 hover:text-red-600 active:scale-95 dark:bg-gray-800 dark:hover:bg-red-900/20"
                      title="Tolak"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "ACCEPT")}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#008C9D] px-6 font-bold whitespace-nowrap text-white shadow-lg shadow-[#008C9D]/20 transition-all hover:scale-105 hover:bg-[#0d9488] active:scale-95 lg:flex-none"
                      title="Terima"
                    >
                      <Play size={18} fill="currentColor" />
                      <span className="hidden sm:inline">Terima</span>
                    </button>
                  </>
                )}

                {variant === "ACCEPTED" && (
                  <button
                    disabled
                    className="flex h-12 flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-100 px-6 font-bold whitespace-nowrap text-gray-400 lg:flex-none dark:border-gray-800 dark:bg-gray-800"
                    title="Menunggu mahasiswa mengunggah bukti"
                  >
                    <Clock size={18} />
                    <span className="hidden sm:inline">Menunggu Bukti</span>
                  </button>
                )}

                {variant === "VERIFYING" && (
                  <>
                    <button
                      onClick={() => handleAction(app.id, "REJECT")}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-transparent bg-gray-50 text-gray-400 transition-all hover:scale-105 hover:border-red-100 hover:bg-red-50 hover:text-red-600 active:scale-95"
                      title="Tolak Bukti"
                    >
                      <X size={20} />
                    </button>
                    <button
                      onClick={() => handleAction(app.id, "COMPLETE")}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 font-bold whitespace-nowrap text-white shadow-lg shadow-green-600/20 transition-all hover:scale-105 hover:bg-green-700 active:scale-95 lg:flex-none"
                      title="Verifikasi & Potong Jam"
                    >
                      <Check size={18} />
                      <span className="hidden sm:inline">Verifikasi</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {isExpanded && app.proofImage1 && (
              <div className="animate-in slide-in-from-top-2 border-t border-gray-100 px-5 pt-0 pb-5 duration-300">
                <div className="space-y-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/50">
                  <h5 className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300">
                    <Eye size={16} />
                    Bukti Pengerjaan yang Dikirim
                  </h5>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <a
                      href={app.proofImage1}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-[#008C9D] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20">
                        <ImageIcon size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Foto Sebelum
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {app.proofImage1}
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="text-gray-300 transition-colors group-hover/link:text-[#008C9D] dark:text-gray-600"
                      />
                    </a>

                    {app.proofImage2 && (
                      <a
                        href={app.proofImage2}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/link flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-all hover:border-[#008C9D] hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500">
                          <ImageIcon size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            Foto Sesudah
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {app.proofImage2}
                          </p>
                        </div>
                        <ExternalLink
                          size={16}
                          className="text-gray-300 transition-colors group-hover/link:text-[#008C9D] dark:text-gray-600"
                        />
                      </a>
                    )}
                  </div>

                  {app.submissionNote && (
                    <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/5 dark:bg-[#0d1117]">
                      <p className="mb-1 text-xs text-gray-400 dark:text-gray-500">
                        Catatan dari Mahasiswa:
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {app.submissionNote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
