"use client";

import { useRef } from "react";
import { Calendar, CheckCircle2, Clock, XCircle, ArrowRight } from "lucide-react";

export type Application = {
    id: number;
    jobTitle: string;
    category: string;
    status: "Pending" | "Approved" | "Rejected" | "Done";
    date: string;
    hours: number;
};

export default function MyApplicationsClient({ applications }: { applications: Application[] }) {
    const container = useRef(null);

    const getStatusStyle = (status: Application["status"]) => {
        const styles = {
            Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
            Approved: "bg-[#008C9D]/10 text-[#008C9D] border-[#008C9D]/20",
            Rejected: "bg-red-50 text-red-700 border-red-200",
            Done: "bg-blue-50 text-blue-700 border-blue-200",
        };
        return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const getStatusIcon = (status: Application["status"]) => {
        switch (status) {
            case "Approved":
            case "Done": return <CheckCircle2 className="w-4 h-4" />;
            case "Rejected": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const getProgressStyles = (status: Application["status"]) => {
        switch (status) {
            case "Done": return { color: "bg-blue-500", width: "w-full" };
            case "Approved": return { color: "bg-[#008C9D]", width: "w-2/3" };
            default: return { color: "bg-yellow-400", width: "w-1/3" };
        }
    };

    return (
        <div ref={container} className="pt-8 px-4 max-w-7xl mx-auto space-y-8 min-h-screen pb-12">
            <header>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    Lamaran Saya
                </h1>
                <p className="text-gray-500 text-lg">
                    Pantau progress dan status pengajuan kompen Anda.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {applications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                        <p className="text-xl font-bold text-gray-400">Belum ada lamaran.</p>
                        <p className="text-gray-400 mt-2">Lamaran yang Anda ajukan akan muncul di sini.</p>
                    </div>
                ) : (
                    applications.map((app) => {
                        const progress = getProgressStyles(app.status);

                        return (
                            <div
                                key={app.id}
                                className="group bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#008C9D]/30 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-2 ${progress.color}`} />

                                <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative z-10 pl-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${getStatusStyle(app.status)}`}>
                                                {getStatusIcon(app.status)}
                                                {app.status}
                                            </span>
                                            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                                {app.category}
                                            </span>
                                        </div>

                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#008C9D] transition-colors">
                                            {app.jobTitle}
                                        </h2>

                                        <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {app.date}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {app.hours} Jam Kompen
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="relative">
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full" />
                                            <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-1000 ${progress.color} ${progress.width}`} />

                                            <div className="relative flex justify-between">
                                                {["Diajukan", "Disetujui", "Selesai"].map((step, i) => {
                                                    const isActive = (i === 0) ||
                                                        (i === 1 && (app.status === "Approved" || app.status === "Done")) ||
                                                        (i === 2 && app.status === "Done");

                                                    return (
                                                        <div key={step} className="flex flex-col items-center gap-2">
                                                            <div className={`w-4 h-4 rounded-full border-2 bg-white z-10 transition-colors duration-500 ${isActive ? (app.status === "Done" ? "border-blue-500 bg-blue-500" : "border-[#008C9D] bg-[#008C9D]") : "border-gray-200"
                                                                }`} />
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-gray-900" : "text-gray-300"}`}>
                                                                {step}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col justify-center md:border-l border-gray-100 md:pl-8">
                                        <button className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 hover:bg-gray-100 px-5 py-3 rounded-xl transition-all">
                                            Detail
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
