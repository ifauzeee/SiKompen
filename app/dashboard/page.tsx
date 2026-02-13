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
  type: "APPROVED" | "DONE" | "WARNING";
  title: string;
  desc: string;
  time: string;
}

type ApplicationWithRelations = JobApplication & {
  user: { name: string; nim: string | null; totalHours: number };
  job: { title: string; hours: number };
};

type DashboardData =
  | {
      role: "ADMIN";
      user: User;
      adminStats: AdminStats;
      applications: ApplicationWithRelations[];
      acceptedApplications: ApplicationWithRelations[];
      topDebtors: { name: string; nim: string | null; totalHours: number }[];
    }
  | {
      role: "PENGAWAS";
      user: User;
      supervisorStats: SupervisorStats;
      applications: ApplicationWithRelations[];
      acceptedApplications: ApplicationWithRelations[];
      verifyingApplications?: ApplicationWithRelations[];
    }
  | {
      role: "MAHASISWA";
      user: User;
      stats: StudentStats;
      activities: Activity[];
    };

export const dynamic = "force-dynamic";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

async function getDashboardData() {
  const session = await getSession();
  if (!session) return null;

  try {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) return null;

    const data = await response.json();

    if (data.role === "ADMIN" || data.role === "PENGAWAS") {
      const pendingApps = await getApplicationsByStatus("PENDING");
      const acceptedApps = await getApplicationsByStatus("ACCEPTED");
      data.applications = pendingApps;
      data.acceptedApplications = acceptedApps;

      if (data.role === "PENGAWAS") {
        data.verifyingApplications = await getApplicationsByStatus("VERIFYING");
      }
    }

    if (data.role === "MAHASISWA") {
      const user = data.user;

      const activities = (user.applications || []).map(
        (app: ApplicationWithRelations) => {
          const config: Record<
            string,
            {
              type: "APPROVED" | "DONE" | "WARNING";
              title: string;
              desc: string;
            }
          > = {
            ACCEPTED: {
              type: "APPROVED",
              title: "Lamaran Disetujui",
              desc: `Anda diterima untuk pekerjaan: ${app.job?.title || "Unknown"}. Segera kerjakan!`,
            },
            PENDING: {
              type: "WARNING",
              title: "Menunggu Konfirmasi",
              desc: `Lamaran untuk ${app.job?.title || "Unknown"} sedang ditinjau.`,
            },
            COMPLETED: {
              type: "DONE",
              title: "Tugas Selesai",
              desc: `Anda telah menyelesaikan tugas: ${app.job?.title || "Unknown"} (+${app.job?.hours || 0} Jam)`,
            },
            REJECTED: {
              type: "WARNING",
              title: "Lamaran Ditolak",
              desc: `Mohon maaf, lamaran untuk ${app.job?.title || "Unknown"} tidak disetujui.`,
            },
          };

          const state = config[app.status] || config.PENDING;

          return {
            id: app.id,
            ...state,
            time: new Date(
              app.appliedAt || new Date().toISOString(),
            ).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
          };
        },
      );

      if (user.totalHours > 20) {
        activities.unshift({
          id: 999,
          type: "WARNING",
          title: "Peringatan Kompen",
          desc: `Sisa tanggungan Anda ${user.totalHours} jam. Segera selesaikan sebelum semester berakhir!`,
          time: "Hari ini",
        });
      }
      data.activities = activities.slice(0, 4);
    }

    return data;
  } catch (_e) {
    console.error("Dashboard Data Fetch Error:", _e);
    return null;
  }
}

async function getTrendData(token: string) {
  try {
    const response = await fetch(`${API_URL}/dashboard/trends`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (_e) {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [data, trendData] = await Promise.all([
    getDashboardData(),
    getTrendData(session.token),
  ]);

  if (!data) {
    redirect("/login");
  }

  const dashboardData = data as
    | DashboardData
    | { role: "KEUANGAN"; user: User };

  if (dashboardData.role === "KEUANGAN") {
    redirect("/dashboard/finance");
  }

  if (dashboardData.role === "ADMIN") {
    const { adminStats, applications, acceptedApplications, topDebtors } =
      dashboardData;
    return (
      <AdminDashboard
        user={dashboardData.user}
        stats={adminStats}
        applications={applications}
        acceptedApplications={acceptedApplications}
        topDebtors={topDebtors}
        trendData={trendData}
      />
    );
  }

  if (dashboardData.role === "PENGAWAS") {
    const { supervisorStats, applications, acceptedApplications } =
      dashboardData;
    const verifyingApplications = dashboardData.verifyingApplications || [];
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

  const studentUser = dashboardData.user as {
    name: string;
    nim: string;
    totalHours: number;
  };
  const studentStats = dashboardData.stats as {
    completedHours: number;
    activeJobs: number;
    activeJobTitle?: string;
  };
  const studentActivities = dashboardData.activities;

  return (
    <DashboardClient
      user={studentUser}
      stats={studentStats}
      activities={studentActivities}
    />
  );
}
