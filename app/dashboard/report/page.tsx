import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ReportClient from "./ReportClient";

import { User } from "@/types";

export const dynamic = 'force-dynamic';

const API_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default async function ReportPage() {
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

    if (!res.ok) return <div>Gagal mengambil data laporan.</div>;

    const allUsers: User[] = await res.json();
    const students = allUsers.filter((u) => u.role === 'MAHASISWA');

    const stats = {
        totalStudents: students.length,
        studentsWithDebt: students.filter((s) => s.totalHours > 0).length,
        totalDebtHours: students.reduce((sum, s) => sum + s.totalHours, 0),
        averageDebt: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.totalHours, 0) / students.length) : 0
    };

    const kelasList = [...new Set(students.map((s) => s.kelas).filter(Boolean))] as string[];

    return <ReportClient students={students} stats={stats} kelasList={kelasList} />;
}
