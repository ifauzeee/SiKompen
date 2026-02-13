import { getSessionUser } from "@/app/actions/auth";
import { getActivityLogs } from "@/app/actions/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Briefcase,
  Settings,
  FileUp,
  CheckCircle,
  XCircle,
  Edit,
} from "lucide-react";
import { ActivityLog } from "@/types";

export const dynamic = "force-dynamic";

const actionIcons: Record<string, React.ReactNode> = {
  APPROVE: <CheckCircle size={16} className="text-green-500" />,
  REJECT: <XCircle size={16} className="text-red-500" />,
  UPDATE_HOURS: <Edit size={16} className="text-orange-500" />,
  UPDATE_SETTINGS: <Settings size={16} className="text-purple-500" />,
  IMPORT_STUDENTS: <FileUp size={16} className="text-blue-500" />,
  CREATE_JOB: <Briefcase size={16} className="text-teal-500" />,
};

const actionLabels: Record<string, string> = {
  APPROVE: "Menyetujui Lamaran",
  REJECT: "Menolak Lamaran",
  UPDATE_HOURS: "Mengubah Jam Hutang",
  UPDATE_SETTINGS: "Mengubah Pengaturan",
  IMPORT_STUDENTS: "Import Data Mahasiswa",
  CREATE_JOB: "Membuat Pekerjaan",
};

export default async function ActivityLogPage() {
  const user = await getSessionUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const logs = await getActivityLogs(100);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-6">
          <Link
            href="/dashboard"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Riwayat Aktivitas
            </h1>
            <p className="text-sm text-gray-500">Log semua aktivitas sistem</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Clock size={48} className="mx-auto mb-4 opacity-50" />
              <p>Belum ada aktivitas tercatat.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {logs.map((log: ActivityLog) => {
                let details = null;
                try {
                  details = log.details ? JSON.parse(log.details) : null;
                } catch {
                  details = null;
                }

                return (
                  <div
                    key={log.id}
                    className="p-6 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-gray-100 p-2">
                        {actionIcons[log.action] || (
                          <Clock size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900">
                          {actionLabels[log.action] || log.action}
                        </p>
                        {details && (
                          <div className="mt-1 text-sm text-gray-500">
                            {log.action === "UPDATE_HOURS" && (
                              <p>
                                {details.studentName}: {details.oldHours} →{" "}
                                {details.newHours} jam
                                {details.reason && (
                                  <span className="mt-1 block text-gray-400">
                                    Alasan: {details.reason}
                                  </span>
                                )}
                              </p>
                            )}
                            {log.action === "IMPORT_STUDENTS" && (
                              <p>
                                Berhasil: {details.successCount}, Skip:{" "}
                                {details.skipCount}, Gagal: {details.errorCount}
                              </p>
                            )}
                            {log.action === "UPDATE_SETTINGS" && (
                              <p>
                                {details.key}: {details.value}
                              </p>
                            )}
                          </div>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                          {new Date(log.createdAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
