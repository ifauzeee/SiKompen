import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import MyJobsClient from "./MyJobsClient";

export const dynamic = 'force-dynamic';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

import { Job } from "@/types";

export default async function MyJobsPage() {
    const session = await getSession();
    if (!session || !['ADMIN', 'PENGAWAS'].includes(session.role)) {
        redirect('/dashboard');
    }

    const res = await fetch(`${API_URL}/jobs`, {
        headers: {
            'Authorization': `Bearer ${session.token}`
        },
        next: { revalidate: 0 }
    });

    if (!res.ok) return <div>Gagal mengambil data pekerjaan.</div>;

    const allJobs: Job[] = await res.json();
    const jobs = allJobs.filter((job) => job.createdById === session.userId);

    return <MyJobsClient jobs={jobs} />;
}
