"use client";

import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { Edit2, Trash2, Plus, Clock, Users, Search } from "lucide-react";
import { deleteJob, toggleJobStatus } from "@/app/actions/jobs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import { Job } from "@/types";
import { Loader2 } from "lucide-react";

export default function MyJobsClient({
  jobs,
}: {
  jobs: (Job & { _count?: { applications: number }; status: string })[];
}) {
  const router = useRouter();
  const { showAlert } = useDialog();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [togglingId, setTogglingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    setIsDeleting(true);
    const res = await deleteJob(id);
    setIsDeleting(false);
    setDeleteId(null);

    if (res?.error) {
      showAlert(res.error, "Gagal Menghapus");
    } else {
      router.refresh();
    }
  }

  async function handleStatusToggle(jobId: number, currentStatus: string) {
    setTogglingId(jobId);
    const res = await toggleJobStatus(jobId, currentStatus);
    setTogglingId(null);

    if (res?.error) {
      showAlert(res.error, "Gagal Mengubah Status");
    } else {
      router.refresh();
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        isDeleting={isDeleting}
        title="Hapus Pekerjaan?"
        description="Pekerjaan yang dihapus tidak dapat dikembalikan. Pastikan tidak ada pelamar yang sedang diproses."
      />

      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
            Pekerjaan Saya
          </h1>
          <p className="text-lg font-medium text-gray-500">
            Kelola data lowongan pekerjaan Anda.
          </p>
        </div>

        <Link
          href="/jobs/create"
          className="flex items-center gap-2 rounded-xl bg-[#008C9D] px-6 py-3 font-bold text-white shadow-lg shadow-[#008C9D]/30 transition-all hover:bg-[#0d9488] hover:shadow-xl hover:shadow-[#008C9D]/40 active:scale-95"
        >
          <Plus size={20} />
          <span>Buat Baru</span>
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-gray-200 bg-white py-20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
              <Search size={32} className="text-gray-900 opacity-20" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">
              Belum ada pekerjaan
            </h3>
            <p className="max-w-md text-center text-gray-500">
              Anda belum membuat lowongan pekerjaan apapun. Mulai buat sekarang
              untuk mendapatkan asisten.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="group relative overflow-hidden rounded-4xl border border-gray-100 bg-white p-8 shadow-lg shadow-gray-100/50 transition-all duration-300 hover:border-[#008C9D]/30"
            >
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-linear-to-br from-[#008C9D]/5 to-[#F4B41A]/5 blur-2xl transition-transform duration-700 group-hover:scale-150"></div>

              <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row">
                <div className="flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-[#008C9D]">
                      {job.title}
                    </h3>
                    <button
                      onClick={() => handleStatusToggle(job.id, job.status)}
                      disabled={!!togglingId}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wide uppercase transition-all hover:scale-105 active:scale-95 ${
                        job.status === "OPEN"
                          ? "border-green-100 bg-green-50 text-green-600 hover:bg-green-100"
                          : "border-gray-200 bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {togglingId === job.id && (
                        <Loader2 size={12} className="animate-spin" />
                      )}
                      {job.status === "OPEN" ? "OPEN" : "SELESAI"}
                    </button>
                  </div>
                  <p className="mb-6 line-clamp-2 max-w-3xl leading-relaxed text-gray-500">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5">
                      <Clock size={16} className="text-[#008C9D]" />
                      <span>{job.hours} Jam Kompen</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5">
                      <Users size={16} className="text-blue-500" />
                      <span>
                        {job._count ? job._count.applications : 0} Pelamar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start md:self-center md:border-l md:border-gray-200 md:pl-8">
                  <Link
                    href={`/dashboard/my-jobs/${job.id}/edit`}
                    className="rounded-xl bg-[#008C9D]/10 p-3 text-[#008C9D] transition-colors hover:bg-[#008C9D]/20"
                    title="Edit Pekerjaan"
                  >
                    <Edit2 size={20} />
                  </Link>

                  <button
                    onClick={() => setDeleteId(job.id)}
                    disabled={isDeleting}
                    className="rounded-xl bg-[#CE2029]/10 p-3 text-[#CE2029] transition-colors hover:bg-[#CE2029]/20 disabled:opacity-50"
                    title="Hapus Pekerjaan"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
