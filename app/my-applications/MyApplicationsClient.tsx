"use client";

import { useState, useTransition } from "react";
import { useDialog } from "@/contexts/DialogContext";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  Loader2,
  Send,
  FileCheck,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { submitJobProof } from "@/app/actions/applications";

export type Application = {
  id: number;
  jobId: number;
  jobTitle: string;
  jobDescription: string;
  hours: number;
  status: "PENDING" | "ACCEPTED" | "VERIFYING" | "COMPLETED" | "REJECTED";
  appliedAt: string;
  proofImage1: string | null;
  proofImage2: string | null;
  submissionNote: string | null;
};

export default function MyApplicationsClient({
  applications,
  userTotalHours = 0,
}: {
  applications: Application[];
  userTotalHours?: number;
}) {
  const { showAlert, showConfirm } = useDialog();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const [proofForms, setProofForms] = useState<
    Record<number, { proof1: string; proof2: string; note: string }>
  >({});

  const getStatusConfig = (status: Application["status"]) => {
    const configs = {
      PENDING: {
        bg: "bg-yellow-50",
        text: "text-yellow-700",
        border: "border-yellow-200",
        icon: <Clock className="h-4 w-4" />,
        label: "Menunggu Persetujuan",
      },
      ACCEPTED: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "Diterima - Silakan Kerjakan",
      },
      VERIFYING: {
        bg: "bg-purple-50",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: <FileCheck className="h-4 w-4" />,
        label: "Menunggu Verifikasi Bukti",
      },
      COMPLETED: {
        bg: "bg-green-50",
        text: "text-green-700",
        border: "border-green-200",
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: "Selesai",
      },
      REJECTED: {
        bg: "bg-red-50",
        text: "text-red-700",
        border: "border-red-200",
        icon: <XCircle className="h-4 w-4" />,
        label: "Ditolak",
      },
    };
    return configs[status] || configs.PENDING;
  };

  const getProgressWidth = (status: Application["status"]) => {
    switch (status) {
      case "PENDING":
        return "w-1/4";
      case "ACCEPTED":
        return "w-2/4";
      case "VERIFYING":
        return "w-3/4";
      case "COMPLETED":
        return "w-full";
      case "REJECTED":
        return "w-0";
      default:
        return "w-0";
    }
  };

  const handleProofChange = (
    appId: number,
    field: "proof1" | "proof2" | "note",
    value: string,
  ) => {
    setProofForms((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [field]: value,
      },
    }));
  };

  const handleSubmitProof = async (appId: number) => {
    const form = proofForms[appId];
    if (!form?.proof1 || !form?.proof2) {
      showAlert(
        "Mohon isi kedua link bukti foto (sebelum & sesudah).",
        "Error",
      );
      return;
    }

    const confirmed = await showConfirm(
      "Kirim bukti pengerjaan? Pastikan link foto sudah benar. Pengawas akan memverifikasi bukti Anda.",
      "Konfirmasi Pengiriman",
    );

    if (!confirmed) return;

    startTransition(async () => {
      const res = await submitJobProof(
        appId,
        form.proof1,
        form.proof2,
        form.note || "",
      );
      if (res?.error) {
        showAlert(res.error, "Gagal");
      } else {
        showAlert(
          "Bukti berhasil dikirim! Tunggu verifikasi dari pengawas.",
          "Berhasil",
        );
        setExpandedId(null);
      }
    });
  };

  return (
    <div className="animate-in fade-in mx-auto min-h-screen max-w-[1600px] space-y-6 px-4 pt-8 pb-24 duration-700 sm:px-8 md:space-y-8 md:pb-12">
      <header className="relative mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div className="pointer-events-none absolute top-0 right-0 -z-10 -mt-10 -mr-10 h-64 w-64 rounded-full bg-[#008C9D]/5 blur-3xl"></div>
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
            Lamaran <span className="text-[#008C9D]">Saya</span>
          </h1>
          <p className="text-base font-medium text-gray-500 md:text-lg">
            Pantau progress dan kirim bukti pengerjaan kompen Anda.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {applications.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center md:py-20">
            <p className="text-lg font-bold text-gray-400 md:text-xl">
              Belum ada lamaran.
            </p>
            <p className="mt-2 text-sm text-gray-400 md:text-base">
              Lamaran yang Anda ajukan akan muncul di sini.
            </p>
          </div>
        ) : (
          applications.map((app) => {
            const statusConfig = getStatusConfig(app.status);
            const isExpanded = expandedId === app.id;
            const form = proofForms[app.id] || {
              proof1: "",
              proof2: "",
              note: "",
            };

            return (
              <div
                key={app.id}
                className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl md:rounded-[2rem]"
              >
                <div className="relative h-1.5 bg-gray-100">
                  <div
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r from-[#008C9D] to-[#00B5CC] transition-all duration-700 ${getProgressWidth(app.status)}`}
                  />
                </div>

                <div className="p-4 md:p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center md:gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-bold md:gap-2 md:px-3 md:py-1.5 md:text-xs ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                        </span>
                      </div>

                      <h2 className="text-xl leading-tight font-bold text-gray-900 md:text-2xl">
                        {app.jobTitle}
                      </h2>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 md:text-sm">
                        <span>Diajukan: {app.appliedAt}</span>
                        <span className="flex items-center gap-1 font-bold text-[#008C9D]">
                          {app.hours} Jam Kompen
                          <span className="hidden font-normal text-gray-400 sm:inline">
                            (Rp {(app.hours * 10000).toLocaleString("id-ID")})
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex w-full items-stretch md:mt-0 md:w-auto md:items-center">
                      {app.status === "ACCEPTED" && (
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : app.id)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A] md:w-auto md:px-6 md:text-base"
                        >
                          <Upload size={18} />
                          Kirim Bukti
                          {isExpanded ? (
                            <ChevronUp size={18} />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </button>
                      )}

                      {app.status === "VERIFYING" && (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700 md:w-auto md:px-6 md:text-base">
                          <Loader2 size={18} className="animate-spin" />
                          Menunggu Verifikasi
                        </div>
                      )}

                      {app.status === "COMPLETED" && (
                        <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-700 md:w-auto md:px-6 md:text-base">
                          <CheckCircle2 size={18} />
                          Jam Terpotong
                        </div>
                      )}
                    </div>
                  </div>

                  {isExpanded && app.status === "ACCEPTED" && (
                    <div className="animate-in slide-in-from-top-4 mt-6 border-t border-gray-100 pt-6 duration-300">
                      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2">
                        <div className="space-y-4">
                          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800 md:text-base">
                              <AlertCircle size={18} />
                              Petunjuk Pengiriman Bukti
                            </h4>
                            <ul className="list-inside list-disc space-y-1.5 text-xs text-blue-700 md:text-sm">
                              <li>
                                Upload foto <strong>SEBELUM</strong> mengerjakan
                                tugas
                              </li>
                              <li>
                                Upload foto <strong>SESUDAH</strong>{" "}
                                menyelesaikan tugas
                              </li>
                              <li>
                                Pastikan foto terlihat jelas dengan{" "}
                                <strong>timestamp</strong>
                              </li>
                              <li>
                                Upload ke Google Drive/Cloud Storage, paste
                                linknya di form
                              </li>
                              <li>
                                Pastikan link bisa diakses publik (Anyone with
                                the link)
                              </li>
                            </ul>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <h4 className="mb-2 text-sm font-bold text-gray-700 md:text-base">
                              Detail Pekerjaan
                            </h4>
                            <p className="text-xs leading-relaxed text-gray-600 md:text-sm">
                              {app.jobDescription}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                              📸 Foto Sebelum (Link) *
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/..."
                              value={form.proof1}
                              onChange={(e) =>
                                handleProofChange(
                                  app.id,
                                  "proof1",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 md:text-base"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                              📸 Foto Sesudah (Link) *
                            </label>
                            <input
                              type="url"
                              placeholder="https://drive.google.com/..."
                              value={form.proof2}
                              onChange={(e) =>
                                handleProofChange(
                                  app.id,
                                  "proof2",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 md:text-base"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">
                              📝 Catatan (Opsional)
                            </label>
                            <textarea
                              placeholder="Tambahkan catatan jika diperlukan..."
                              value={form.note}
                              onChange={(e) =>
                                handleProofChange(
                                  app.id,
                                  "note",
                                  e.target.value,
                                )
                              }
                              rows={3}
                              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium transition-all outline-none focus:border-[#008C9D] focus:ring-4 focus:ring-[#008C9D]/10 md:text-base"
                            />
                          </div>

                          <button
                            onClick={() => handleSubmitProof(app.id)}
                            disabled={isPending || !form.proof1 || !form.proof2}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#008C9D] py-3 text-sm font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A] disabled:cursor-not-allowed disabled:opacity-50 md:py-4 md:text-base"
                          >
                            {isPending ? (
                              <>
                                <Loader2 className="animate-spin" size={20} />
                                Mengirim...
                              </>
                            ) : (
                              <>
                                <Send size={20} />
                                Kirim Bukti Pengerjaan
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {app.status === "VERIFYING" && app.proofImage1 && (
                    <div className="mt-6 border-t border-gray-100 pt-6">
                      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700 md:text-base">
                        <Eye size={18} />
                        Bukti yang Dikirim
                      </h4>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <a
                          href={app.proofImage1}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block truncate rounded-xl bg-gray-50 px-4 py-3 text-xs font-medium text-[#008C9D] transition-colors hover:bg-gray-100 md:text-sm"
                        >
                          📸 Foto Sebelum: {app.proofImage1}
                        </a>
                        {app.proofImage2 && (
                          <a
                            href={app.proofImage2}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block truncate rounded-xl bg-gray-50 px-4 py-3 text-xs font-medium text-[#008C9D] transition-colors hover:bg-gray-100 md:text-sm"
                          >
                            📸 Foto Sesudah: {app.proofImage2}
                          </a>
                        )}
                      </div>
                      {app.submissionNote && (
                        <p className="mt-3 text-xs text-gray-500 md:text-sm">
                          <strong>Catatan:</strong> {app.submissionNote}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {(() => {
        const activeApps = applications.filter((a) =>
          ["PENDING", "ACCEPTED", "VERIFYING"].includes(a.status),
        );
        const totalPotentialHours = activeApps.reduce(
          (sum, app) => sum + app.hours,
          0,
        );

        const remainingHours = Math.max(
          0,
          userTotalHours - totalPotentialHours,
        );

        if (totalPotentialHours > 0) {
          return (
            <div className="animate-in slide-in-from-bottom-4 fixed right-4 bottom-6 left-4 z-40 flex justify-center duration-500 md:absolute md:right-auto md:bottom-8 md:left-1/2 md:left-auto md:w-auto md:-translate-x-1/2 lg:left-72 lg:translate-x-8">
              <div className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gray-800 bg-gray-900 px-4 py-3 text-white shadow-2xl md:w-auto md:justify-start md:gap-4 md:rounded-full md:px-6 md:py-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`shrink-0 rounded-full p-2 ${remainingHours === 0 ? "bg-green-500" : "bg-[#008C9D]"}`}
                  >
                    {remainingHours === 0 ? (
                      <CheckCircle2 size={18} className="text-white" />
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
