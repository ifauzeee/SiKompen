import JobsList from "./JobsList";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function getJobs(token?: string) {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/jobs`, { headers, next: { revalidate: 0 } });
    if (!res.ok) return [];
    return await res.json();
}

import { JobApplication } from "@/types";

export default async function JobsPage() {
    const session = await getSession();
    const jobs = await getJobs(session?.token);

    let appliedJobIds: number[] = [];
    const userRole = session?.role;
    let userTotalHours = 0;
    const userId = session?.userId;

    if (session) {
        const res = await fetch(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${session.token}` }
        });
        if (res.ok) {
            const userData = await res.json();
            userTotalHours = userData.totalHours;

            const appRes = await fetch(`${API_URL}/applications`, {
                headers: { 'Authorization': `Bearer ${session.token}` }
            });
            if (appRes.ok) {
                const apps: JobApplication[] = await appRes.json();
                appliedJobIds = apps
                    .filter((app) => app.userId === userId)
                    .map((app) => app.jobId);
            }
        }
    }

    return <JobsList jobs={jobs} appliedJobIds={appliedJobIds} userRole={userRole} userTotalHours={userTotalHours} />;
}
