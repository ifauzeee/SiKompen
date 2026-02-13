import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default async function SettingsPage() {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const res = await fetch(`${API_URL}/admin/settings`, {
        headers: {
            'Authorization': `Bearer ${session.token}`
        },
        next: { revalidate: 0 }
    });

    const settings = res.ok ? await res.json() : [];

    const defaultSettings = [
        { key: 'semester_aktif', value: '2024/2025 Ganjil', description: 'Semester yang sedang aktif' },
        { key: 'batas_jam_kompen', value: '100', description: 'Batas maksimum jam kompen per mahasiswa' },
        { key: 'bank_account', value: 'BNI 1234567890 a.n. Politeknik Negeri Jakarta', description: 'Informasi rekening pembayaran kompen' },
    ];

    const mergedSettings = defaultSettings.map(def => {
        const existing = settings.find((s: any) => s.key === def.key);
        return existing || def;
    });

    return <SettingsClient settings={mergedSettings} />;
}
