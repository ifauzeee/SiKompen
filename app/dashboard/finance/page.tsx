import { getSession } from "@/lib/session";
import FinanceDashboardClient from "./FinanceDashboardClient";
import { redirect } from "next/navigation";

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default async function FinancePage() {
    const session = await getSession();

    if (!session || (session.role !== 'KEUANGAN' && session.role !== 'ADMIN')) {
        redirect('/dashboard');
    }

    const res = await fetch(`${API_URL}/finance/stats`, {
        headers: {
            'Authorization': `Bearer ${session.token}`
        },
        next: { revalidate: 0 }
    });

    if (!res.ok) return <div>Gagal mengambil data finance.</div>;

    const data = await res.json();

    return (
        <FinanceDashboardClient
            payments={data.payments}
            stats={data.stats}
            history={data.history}
            debtors={data.debtors}
        />
    );
}
