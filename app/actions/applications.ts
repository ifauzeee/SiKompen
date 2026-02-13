"use server";

import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function getApplicationsByStatus(status: 'PENDING' | 'ACCEPTED' | 'VERIFYING' = 'PENDING', supervisorId?: number) {
    const session = await getSession();
    if (!session || !['ADMIN', 'PENGAWAS'].includes(session.role)) return [];

    try {
        const url = new URL(`${API_URL}/applications`);
        url.searchParams.append('status', status);
        if (supervisorId) url.searchParams.append('supervisorId', supervisorId.toString());

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

export async function submitJobProof(appId: number, proof1: string, proof2: string, note: string) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized" };

    try {
        const response = await fetch(`${API_URL}/applications/${appId}/proof`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ proof1, proof2, note })
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || "Gagal mengirim bukti." };

        revalidatePath('/dashboard/my-applications');
        revalidatePath('/dashboard/my-jobs');
        return { success: true };
    } catch (e) {
        return { error: "Gagal menghubungi server." };
    }
}

export async function updateApplicationStatus(appId: number, status: 'ACCEPTED' | 'COMPLETED' | 'REJECTED') {
    const session = await getSession();
    if (!session || !['ADMIN', 'PENGAWAS'].includes(session.role)) return { error: 'Unauthorized' };

    try {
        const response = await fetch(`${API_URL}/applications/${appId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify({ status })
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || 'Gagal memproses validasi.' };

        revalidatePath('/dashboard');
        revalidatePath('/jobs');
        revalidatePath('/dashboard/my-jobs');
        revalidatePath('/my-applications');
        return { success: true };
    } catch (e) {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function applyForJob(jobId: number) {
    const session = await getSession();
    if (!session) return { error: "Anda harus login untuk melamar." };

    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || "Terjadi kesalahan saat mengirim lamaran." };

        revalidatePath('/jobs');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        return { error: "Gagal menghubungi server." };
    }
}
