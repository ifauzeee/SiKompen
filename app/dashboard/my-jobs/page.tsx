import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import MyJobsClient from "./MyJobsClient";
export const dynamic = 'force-dynamic';

export default async function MyJobsPage() {
    const user = await getSessionUser();
    if (!user || !['ADMIN', 'PENGAWAS'].includes(user.role)) {
        redirect('/dashboard');
    }

    const jobs = await prisma.job.findMany({
        where: { createdById: user.id },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: { applications: true }
            }
        }
    });

    return <MyJobsClient jobs={jobs} />;
}
