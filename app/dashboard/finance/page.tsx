import { getSession } from "@/lib/session";
import FinanceDashboardClient from "./FinanceDashboardClient";
import { redirect } from "next/navigation";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

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

export default async function FinancePage() {
  const session = await getSession();

  if (!session || (session.role !== "KEUANGAN" && session.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const [statsRes, trendData] = await Promise.all([
    fetch(`${API_URL}/dashboard/finance`, {
      headers: { Authorization: `Bearer ${session.token}` },
      next: { revalidate: 0 },
    }),
    getTrendData(session.token),
  ]);

  if (!statsRes.ok) return <div>Gagal mengambil data finance.</div>;

  const data = await statsRes.json();

  return (
    <FinanceDashboardClient
      payments={data.payments}
      stats={data.stats}
      history={data.history}
      debtors={data.debtors}
      trendData={trendData}
    />
  );
}
