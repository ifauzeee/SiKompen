import DashboardClient from "./DashboardClient";
import AdminDashboard from "./AdminDashboard";
import SupervisorDashboard from "./SupervisorDashboard";
import { getSession } from "@/lib/session";
import { getApplicationsByStatus } from "@/app/actions/applications";
import { redirect } from "next/navigation";

import { User, JobApplication } from "@/types";

interface AdminStats {
    totalStudents: number;
    activeJobs: number;
    pendingValidations: number;
    totalIncome: number;
}

interface SupervisorStats {
    myJobs: number;
    pendingValidations: number;
    verifyingCount: number;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

async function getDashboardData() {
    const session = await getSession();
    if (!session) return null;

    try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${session.token}`
            },
            next: { revalidate: 0 } // force dynamic
        });

        if (!response.ok) return null;

        const data = await response.json();

        // Fetch additional data if needed (like applications)
        if (data.role === 'ADMIN' || data.role === 'PENGAWAS') {
            const pendingApps = await getApplicationsByStatus('PENDING');
            const acceptedApps = await getApplicationsByStatus('ACCEPTED');
            data.applications = pendingApps;
            data.acceptedApplications = acceptedApps;

            if (data.role === 'PENGAWAS') {
                data.verifyingApplications = await getApplicationsByStatus('VERIFYING');
            }
        }

        if (data.role === 'MAHASISWA') {
            // Transform activities for student
            const user = data.user;
            const activities = user.Applications.map((app: any) => {
                const config: Record<string, { type: 'APPROVED' | 'DONE' | 'WARNING', title: string, desc: string }> = {
                    ACCEPTED: {
                        type: 'APPROVED',
                        title: 'Lamaran Disetujui',
                        desc: `Anda diterima untuk pekerjaan: ${app.Job.Title}. Segera kerjakan!`
                    },
                    PENDING: {
                        type: 'WARNING',
                        title: 'Menunggu Konfirmasi',
                        desc: `Lamaran untuk ${app.Job.Title} sedang ditinjau.`
                    },
                    COMPLETED: {
                        type: 'DONE',
                        title: 'Tugas Selesai',
                        desc: `Anda telah menyelesaikan tugas: ${app.Job.Title} (+${app.Job.Hours} Jam)`
                    },
                    REJECTED: {
                        type: 'WARNING',
                        title: 'Lamaran Ditolak',
                        desc: `Mohon maaf, lamaran untuk ${app.Job.Title} tidak disetujui.`
                    }
                };

                const state = config[app.Status] || config.PENDING;

                return {
                    id: app.ID,
                    ...state,
                    time: new Date(app.CreatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                };
            });

            if (user.TotalHours > 20) {
                activities.unshift({
                    id: 999,
                    type: 'WARNING',
                    title: 'Peringatan Kompen',
                    desc: `Sisa tanggungan Anda ${user.TotalHours} jam. Segera selesaikan sebelum semester berakhir!`,
                    time: 'Hari ini'
                });
            }
            data.activities = activities.slice(0, 4);
        }

        return data;
    } catch (_e) {
        console.error('Dashboard Data Fetch Error:', _e);
        return null;
    }
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
        const verifyingApplications = (dashboardData as any).verifyingApplications || [];
        return (
            <SupervisorDashboard
                user={dashboardData.user}
                stats={supervisorStats}
                applications={applications}
                acceptedApplications={acceptedApplications}
                verifyingApplications={verifyingApplications}
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
