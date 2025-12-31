import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import EditJobClient from "./EditJobClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
    const user = await getSessionUser();
    const { id } = await params;

    const jobId = parseInt(id);
    if (isNaN(jobId)) redirect('/dashboard/my-jobs');

    const job = await prisma.job.findUnique({
        where: { id: jobId }
    });

    if (!job) redirect('/dashboard/my-jobs');

    if (!user || (user.role !== 'ADMIN' && job.createdById !== user.id)) {
        redirect('/dashboard/my-jobs');
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="border-b border-gray-200 bg-white sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard/my-jobs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                            <ArrowLeft size={24} />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900">Edit Pekerjaan</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <EditJobClient job={job} />
            </div>
        </div>
    );
}
