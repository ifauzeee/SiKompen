import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import ReportClient from "./ReportClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function ReportPage() {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const students = await prisma.user.findMany({
        where: { role: 'MAHASISWA' },
        select: {
            nim: true,
            name: true,
            prodi: true,
            kelas: true,
            totalHours: true
        },
        orderBy: [{ kelas: 'asc' }, { name: 'asc' }]
    });

    const stats = {
        totalStudents: students.length,
        studentsWithDebt: students.filter(s => s.totalHours > 0).length,
        totalDebtHours: students.reduce((sum, s) => sum + s.totalHours, 0),
        averageDebt: students.length > 0 ? Math.round(students.reduce((sum, s) => sum + s.totalHours, 0) / students.length) : 0
    };

    const kelasList = [...new Set(students.map(s => s.kelas).filter(Boolean))] as string[];

    return <ReportClient students={students} stats={stats} kelasList={kelasList} />;
}
