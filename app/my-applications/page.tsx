import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import MyApplicationsClient from "./MyApplicationsClient";

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage() {
    const user = await getSessionUser();
    if (!user) redirect("/login");

    const applications = await prisma.jobApplication.findMany({
        where: { userId: user.id },
        include: { job: true },
        orderBy: { appliedAt: "desc" },
    });

    const formattedApps = applications.map(app => ({
        id: app.id,
        jobId: app.jobId,
        jobTitle: app.job.title,
        jobDescription: app.job.description,
        hours: app.job.hours,
        status: app.status as "PENDING" | "ACCEPTED" | "VERIFYING" | "COMPLETED" | "REJECTED",
        appliedAt: app.appliedAt.toLocaleDateString('id-ID'),
        proofImage1: app.proofImage1,
        proofImage2: app.proofImage2,
        submissionNote: app.submissionNote,
    }));

    return <MyApplicationsClient applications={formattedApps} userTotalHours={user.totalHours} />;
}
