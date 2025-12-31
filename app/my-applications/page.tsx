import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
    const user = await getSessionUser();
    if (!user) redirect("/login");

    const applications = await prisma.jobApplication.findMany({
        where: { userId: user.id },
        include: { job: true },
        orderBy: { appliedAt: "desc" },
    });

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-[#008C9D]/10 text-[#008C9D]";
            case "REJECTED": return "bg-[#CE2029]/10 text-[#CE2029]";
            case "DONE": return "bg-[#008C9D]/10 text-[#008C9D]";
            default: return "bg-[#F4B41A]/10 text-[#F4B41A]";
        }
    };

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Lamaran Saya</h1>
                    <p className="text-gray-500 text-lg font-medium">Pantau status lamaran pekerjaan Anda disana.</p>
                </div>
            </header>

            <div className="space-y-4">
                {applications.length === 0 ? (
                    <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 text-gray-500">
                        Belum ada lamaran. Yuk cari pekerjaan di menu Pekerjaan!
                    </div>
                ) : (
                    applications.map((app) => (
                        <div
                            key={app.id}
                            className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all flex justify-between items-center group"
                        >
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#008C9D] transition-colors">
                                    {app.job.title}
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">
                                    Diajukan pada: {app.appliedAt.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${getStatusStyles(app.status)}`}>
                                    {(app.status === "APPROVED" || app.status === "DONE") && <CheckCircle size={14} />}
                                    {app.status === "REJECTED" && <XCircle size={14} />}
                                    {app.status === "PENDING" && <Clock size={14} />}
                                    {app.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
