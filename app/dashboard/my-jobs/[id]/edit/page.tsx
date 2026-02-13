import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import EditJobClient from "./EditJobClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

import { Job } from "@/types";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  const { id } = await params;

  const jobId = parseInt(id);
  if (isNaN(jobId)) redirect("/dashboard/my-jobs");

  if (!session) redirect("/login");

  const res = await fetch(`${API_URL}/jobs`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) redirect("/dashboard/my-jobs");

  const allJobs: Job[] = await res.json();
  const job = allJobs.find((j) => j.id === jobId);

  if (!job) redirect("/dashboard/my-jobs");

  if (session.role !== "ADMIN" && job.createdById !== session.userId) {
    redirect("/dashboard/my-jobs");
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/my-jobs"
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Edit Pekerjaan</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <EditJobClient job={job} />
      </div>
    </div>
  );
}
