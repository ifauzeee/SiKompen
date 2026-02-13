import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyApplicationsClient from "./MyApplicationsClient";

export const dynamic = "force-dynamic";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

import { JobApplication } from "@/types";

export default async function MyApplicationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const res = await fetch(`${API_URL}/applications`, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return <div>Gagal mengambil data.</div>;

  const applications: JobApplication[] = await res.json();

  const userRes = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${session.token}` },
  });
  const user = await userRes.json();

  const formattedApps = applications
    .filter((app) => app.userId === session.userId)
    .map((app) => ({
      id: app.id,
      jobId: app.jobId,
      jobTitle: app.job?.title || "Unknown",
      jobDescription: app.job?.description || "-",
      hours: app.job?.hours || 0,
      status: app.status as
        | "PENDING"
        | "ACCEPTED"
        | "VERIFYING"
        | "COMPLETED"
        | "REJECTED",
      appliedAt: new Date(app.appliedAt).toLocaleDateString("id-ID"),
      proofImage1: app.proofImage1 || null,
      proofImage2: app.proofImage2 || null,
      submissionNote: app.submissionNote || null,
    }));

  return (
    <MyApplicationsClient
      applications={formattedApps}
      userTotalHours={user.totalHours}
    />
  );
}
