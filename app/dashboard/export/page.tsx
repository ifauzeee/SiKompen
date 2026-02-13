import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ExportClient from "./ExportClient";

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default async function ExportPage() {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const res = await fetch(`${API_URL}/admin/users`, {
        headers: {
            'Authorization': `Bearer ${session.token}`
        },
        next: { revalidate: 0 }
    });

    if (!res.ok) return <div>Gagal mengambil data export.</div>;

    const allUsers = await res.json();
    const students = allUsers.filter((u: any) => u.role === 'MAHASISWA');

    const prodis = [...new Set(students.map((s: any) => s.prodi).filter(Boolean))] as string[];
    const kelasList = [...new Set(students.map((s: any) => s.kelas).filter(Boolean))] as string[];

    return <ExportClient prodis={prodis} kelasList={kelasList} />;
}
