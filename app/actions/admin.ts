"use server";

import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function updateStudentHours(studentId: number, newHours: number, reason: string) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return { error: 'Unauthorized. Admin access required.' };
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${studentId}/hours`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ newHours, reason })
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || 'Gagal mengupdate jam hutang.' };

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (e) {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function getActivityLogs(limit: number = 50) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return [];

    try {
        const response = await fetch(`${API_URL}/admin/logs?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        });

        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

export async function getSystemSettings() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return [];

    try {
        const response = await fetch(`${API_URL}/admin/settings`, {
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        });

        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}

export async function updateSystemSetting(key: string, value: string) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await fetch(`${API_URL}/admin/settings/${key}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ value })
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || 'Gagal menyimpan pengaturan.' };

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (e) {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function importStudents(data: { nim: string; name: string; prodi: string; kelas: string }[]) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return { error: 'Unauthorized' };
    }

    try {
        const response = await fetch(`${API_URL}/admin/students/import`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(data)
        });

        const resData = await response.json();
        if (!response.ok) return { error: resData.error || 'Gagal mengimport data.' };

        revalidatePath('/dashboard/users');
        return { success: true, ...resData };
    } catch (e) {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function getStudentsForExport(filters?: { prodi?: string; kelas?: string; hasDebt?: boolean }) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return [];

    try {
        const url = new URL(`${API_URL}/admin/students/export`);
        if (filters?.prodi) url.searchParams.append('prodi', filters.prodi);
        if (filters?.kelas) url.searchParams.append('kelas', filters.kelas);
        if (filters?.hasDebt) url.searchParams.append('hasDebt', 'true');

        const response = await fetch(url.toString(), {
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        });

        if (!response.ok) return [];
        return await response.json();
    } catch {
        return [];
    }
}
