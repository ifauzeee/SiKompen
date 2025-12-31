import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";
import AdminDashboard from "./AdminDashboard";
import SupervisorDashboard from "./SupervisorDashboard";
import { getSessionUser } from "@/app/actions/auth";
import { getApplicationsByStatus } from "@/app/actions/applications";
import { redirect } from "next/navigation";

import { User, JobApplication } from "@prisma/client";

interface AdminStats {
    totalStudents: number;
    activeJobs: number;
    pendingValidations: number;
    totalIncome: number;
}

interface SupervisorStats {
    myJobs: number;
    pendingValidations: number;
}

interface StudentStats {
    completedHours: number;
    activeJobs: number;
    activeJobTitle?: string;
}

interface Activity {
    id: number;
    type: 'APPROVED' | 'DONE' | 'WARNING';
    title: string;
    desc: string;
    time: string;
}

type ApplicationWithRelations = JobApplication & { user: { name: string; nim: string | null; totalHours: number }; job: { title: string; hours: number } };

type DashboardData =
    | { role: 'ADMIN'; user: User; adminStats: AdminStats; applications: ApplicationWithRelations[]; acceptedApplications: ApplicationWithRelations[]; topDebtors: { name: string; nim: string | null; totalHours: number }[] }
    | { role: 'PENGAWAS'; user: User; supervisorStats: SupervisorStats; applications: ApplicationWithRelations[]; acceptedApplications: ApplicationWithRelations[] }
    | { role: 'MAHASISWA'; user: User; stats: StudentStats; activities: Activity[]; };

export const dynamic = 'force-dynamic';

async function getDashboardData() {
    const sessionUser = await getSessionUser();
    if (!sessionUser) return null;

    const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        include: {
            applications: {
                include: { job: true },
                orderBy: { appliedAt: 'desc' },
            }
        }
    });

    if (!user) return null;

    const { password, ...userWithoutPassword } = user;
    const cleanUser = userWithoutPassword as unknown as User;

    if (cleanUser.role === 'KEUANGAN') {
        return {
            role: 'KEUANGAN',
            user: { ...cleanUser, role: 'KEUANGAN' }
        };
    }

    if (cleanUser.role === 'ADMIN') {
        const totalStudents = await prisma.user.count({ where: { role: 'MAHASISWA' } });
        const activeJobs = await prisma.job.count({ where: { status: 'OPEN' } });
        const pendingValidations = await prisma.jobApplication.count({ where: { status: 'PENDING' } });

        const totalIncome = await (prisma as any).payment.aggregate({
            _sum: { amount: true },
            where: { status: 'APPROVED' }
        }).then((res: any) => res._sum.amount || 0);

        const pendingApps = await getApplicationsByStatus('PENDING');
        const acceptedApps = await getApplicationsByStatus('ACCEPTED');

        const topDebtors = await prisma.user.findMany({
            where: { role: 'MAHASISWA', totalHours: { gt: 0 } },
            orderBy: { totalHours: 'desc' },
            take: 5,
            select: { name: true, nim: true, totalHours: true }
        });

        return {
            role: 'ADMIN',
            user: { ...cleanUser, role: 'ADMIN' },
            adminStats: {
                totalStudents,
                activeJobs,
                pendingValidations,
                totalIncome
            },
            applications: pendingApps,
            acceptedApplications: acceptedApps,
            topDebtors
        };
    }

    if (cleanUser.role === 'PENGAWAS') {
        const myJobs = await prisma.job.count({ where: { createdById: cleanUser.id } });

        const pendingValidations = await prisma.jobApplication.count({
            where: {
                status: 'PENDING',
                job: { createdById: cleanUser.id }
            }
        });

        const pendingApps = await getApplicationsByStatus('PENDING', cleanUser.id);
        const acceptedApps = await getApplicationsByStatus('ACCEPTED', cleanUser.id);

        return {
            role: 'PENGAWAS',
            user: { ...cleanUser, role: 'PENGAWAS' },
            supervisorStats: {
                myJobs,
                pendingValidations
            },
            applications: pendingApps,
            acceptedApplications: acceptedApps
        };
    }

    const activeApps = user.applications.filter(app => ['ACCEPTED', 'PENDING'].includes(app.status));
    const completedApps = user.applications.filter(app => app.status === 'COMPLETED');

    const completedHours = completedApps.reduce((sum, app) => sum + app.job.hours, 0);

    const activities = user.applications.map(app => {
        const config: Record<string, { type: 'APPROVED' | 'DONE' | 'WARNING', title: string, desc: string }> = {
            ACCEPTED: {
                type: 'APPROVED',
                title: 'Lamaran Disetujui',
                desc: `Anda diterima untuk pekerjaan: ${app.job.title}. Segera kerjakan!`
            },
            PENDING: {
                type: 'WARNING',
                title: 'Menunggu Konfirmasi',
                desc: `Lamaran untuk ${app.job.title} sedang ditinjau.`
            },
            COMPLETED: {
                type: 'DONE',
                title: 'Tugas Selesai',
                desc: `Anda telah menyelesaikan tugas: ${app.job.title} (+${app.job.hours} Jam)`
            },
            REJECTED: {
                type: 'WARNING',
                title: 'Lamaran Ditolak',
                desc: `Mohon maaf, lamaran untuk ${app.job.title} tidak disetujui.`
            }
        };

        const state = config[app.status] || config.PENDING;

        return {
            id: app.id,
            ...state,
            time: app.appliedAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
        };
    });

    if (cleanUser.totalHours > 20) {
        activities.unshift({
            id: 999,
            type: 'WARNING',
            title: 'Peringatan Kompen',
            desc: `Sisa tanggungan Anda ${cleanUser.totalHours} jam. Segera selesaikan sebelum semester berakhir!`,
            time: 'Hari ini'
        });
    }

    return {
        role: 'MAHASISWA',
        user: { ...cleanUser, role: 'MAHASISWA' },
        stats: {
            completedHours,
            activeJobs: activeApps.length,
            activeJobTitle: activeApps[0]?.job.title
        },
        activities: activities.slice(0, 4)
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (!data) {
        redirect('/login');
    }

    const dashboardData = data as DashboardData | { role: 'KEUANGAN'; user: User; };

    if (dashboardData.role === 'KEUANGAN') {
        redirect('/dashboard/finance');
    }

    if (dashboardData.role === 'ADMIN') {
        const { adminStats, applications, acceptedApplications, topDebtors } = dashboardData;
        return (
            <AdminDashboard
                user={dashboardData.user}
                stats={adminStats}
                applications={applications}
                acceptedApplications={acceptedApplications}
                topDebtors={topDebtors}
            />
        );
    }

    if (dashboardData.role === 'PENGAWAS') {
        const { supervisorStats, applications, acceptedApplications } = dashboardData;
        return (
            <SupervisorDashboard
                user={dashboardData.user}
                stats={supervisorStats}
                applications={applications}
                acceptedApplications={acceptedApplications}
            />
        );
    }

    const studentUser = dashboardData.user as { name: string; nim: string; totalHours: number };
    const studentStats = dashboardData.stats as { completedHours: number; activeJobs: number; activeJobTitle?: string };
    const studentActivities = dashboardData.activities;


    return (
        <DashboardClient
            user={studentUser}
            stats={studentStats}
            activities={studentActivities}
        />
    );
}
