"use client";


import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import { Edit2, Trash2, Plus, Clock, Users, Search } from "lucide-react";
import { deleteJob, toggleJobStatus } from "@/app/actions/jobs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import { Job } from "@prisma/client";
import { Loader2 } from "lucide-react";

export default function MyJobsClient({ jobs }: { jobs: (Job & { _count: { applications: number }, status: string })[] }) {
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
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <DeleteModal
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={() => deleteId && handleDelete(deleteId)}
                isDeleting={isDeleting}
                title="Hapus Pekerjaan?"
                description="Pekerjaan yang dihapus tidak dapat dikembalikan. Pastikan tidak ada pelamar yang sedang diproses."
            />

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">
                        Pekerjaan Saya
                    </h1>
                    <p className="text-gray-500 text-lg font-medium">
                        Kelola data lowongan pekerjaan Anda.
                    </p>
                </div>

                <Link
                    href="/jobs/create"
                    className="flex items-center gap-2 bg-[#008C9D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0d9488] transition-all shadow-lg shadow-[#008C9D]/30 hover:shadow-xl hover:shadow-[#008C9D]/40 active:scale-95"
                >
                    <Plus size={20} />
                    <span>Buat Baru</span>
                </Link>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {jobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Search size={32} className="opacity-20 text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pekerjaan</h3>
                        <p className="text-gray-500 text-center max-w-md">
                            Anda belum membuat lowongan pekerjaan apapun. Mulai buat sekarang untuk mendapatkan asisten.
                        </p>
                    </div>
                ) : (
                    jobs.map((job) => (
                        <div key={job.id} className="group bg-white p-8 rounded-[2rem] border border-gray-100 shadow-lg shadow-gray-100/50 hover:border-[#008C9D]/30 transition-all duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#008C9D]/5 to-[#F4B41A]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>

                            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#008C9D] transition-colors">
                                            {job.title}
                                        </h3>
                                        <button
                                            onClick={() => handleStatusToggle(job.id, job.status)}
                                            disabled={!!togglingId}
                                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border flex items-center gap-2 transition-all hover:scale-105 active:scale-95 ${job.status === 'OPEN'
                                                ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                                }`}
                                        >
                                            {togglingId === job.id && <Loader2 size={12} className="animate-spin" />}
                                            {job.status === 'OPEN' ? 'OPEN' : 'SELESAI'}
                                        </button>
                                    </div>
                                    <p className="text-gray-500 mb-6 line-clamp-2 leading-relaxed max-w-3xl">
                                        {job.description}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-500">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                            <Clock size={16} className="text-[#008C9D]" />
                                            <span>{job.hours} Jam Kompen</span>
                                        </div>
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
                                            <Users size={16} className="text-blue-500" />
                                            <span>{job._count ? job._count.applications : 0} Pelamar</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 self-start md:self-center md:border-l md:border-gray-200 md:pl-8">
                                    <Link
                                        href={`/dashboard/my-jobs/${job.id}/edit`}
                                        className="p-3 text-[#008C9D] bg-[#008C9D]/10 hover:bg-[#008C9D]/20 rounded-xl transition-colors"
                                        title="Edit Pekerjaan"
                                    >
                                        <Edit2 size={20} />
                                    </Link>

                                    <button
                                        onClick={() => setDeleteId(job.id)}
                                        disabled={isDeleting}
                                        className="p-3 text-[#CE2029] bg-[#CE2029]/10 hover:bg-[#CE2029]/20 rounded-xl transition-colors disabled:opacity-50"
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
