import { prisma } from "@/lib/prisma";
import JobsList from "./JobsList";
import { getSessionUser } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

async function getJobs() {
    return await prisma.job.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            createdBy: {
                select: { name: true },
            },
        },
    });
}

export default async function JobsPage() {
    const jobs = await getJobs();
    const user = await getSessionUser();

    let appliedJobIds: number[] = [];
    if (user) {
        const apps = await prisma.jobApplication.findMany({
            where: { userId: user.id },
            select: { jobId: true }
        });
        appliedJobIds = apps.map(app => app.jobId);
    }

    return <JobsList jobs={jobs} appliedJobIds={appliedJobIds} userRole={user?.role} userTotalHours={user?.totalHours} />;
}
