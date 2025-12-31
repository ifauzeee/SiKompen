import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const settings = await prisma.systemSettings.findMany();

    const defaultSettings = [
        { key: 'semester_aktif', value: '2024/2025 Ganjil', description: 'Semester yang sedang aktif' },
        { key: 'batas_jam_kompen', value: '100', description: 'Batas maksimum jam kompen per mahasiswa' },
        { key: 'bank_account', value: 'BNI 1234567890 a.n. Politeknik Negeri Jakarta', description: 'Informasi rekening pembayaran kompen' },
    ];

    const mergedSettings = defaultSettings.map(def => {
        const existing = settings.find(s => s.key === def.key);
        return existing || def;
    });

    return <SettingsClient settings={mergedSettings} />;
}
