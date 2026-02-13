import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyApplicationsClient from "./MyApplicationsClient";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default async function MyApplicationsPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const res = await fetch(`${API_URL}/applications`, {
        headers: {
            'Authorization': `Bearer ${session.token}`
        },
        next: { revalidate: 0 }
    });

    if (!res.ok) return <div>Gagal mengambil data.</div>;

    const applications = await res.json();

    // Fetch user for totalHours
    const userRes = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${session.token}` }
    });
    const user = await userRes.json();

    const formattedApps = applications
        .filter((app: any) => app.userId === session.userId)
        .map((app: any) => ({
            id: app.id,
            jobId: app.jobId,
            jobTitle: app.job.title,
            jobDescription: app.job.description,
            hours: app.job.hours,
            status: app.status as "PENDING" | "ACCEPTED" | "VERIFYING" | "COMPLETED" | "REJECTED",
            appliedAt: new Date(app.appliedAt).toLocaleDateString('id-ID'),
            proofImage1: app.proofImage1,
            proofImage2: app.proofImage2,
            submissionNote: app.submissionNote,
        }));

    return <MyApplicationsClient applications={formattedApps} userTotalHours={user.totalHours} />;
}
