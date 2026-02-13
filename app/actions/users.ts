"use server";

import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateUserSchema = z.object({
    name: z.string().min(1, "Nama wajib diisi"),
    username: z.string().min(1, "Username wajib diisi"),
    password: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(['MAHASISWA', 'ADMIN', 'KEUANGAN', 'PENGAWAS']),
    nim: z.string().nullable().optional(),
    prodi: z.string().nullable().optional(),
    kelas: z.string().nullable().optional(),
    totalHours: z.number().int().nonnegative().default(0)
});

import { hashPassword } from "@/lib/password";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function createUser(formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
        return { error: 'Unauthorized. Admin access required.' };
    }

    const payload = {
        name: formData.get('name') as string,
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as string,
        nim: (formData.get('nim') as string)?.trim() || "",
        prodi: (formData.get('prodi') as string)?.trim() || "",
        kelas: (formData.get('kelas') as string)?.trim() || "",
        totalHours: formData.get('totalHours') ? parseInt(formData.get('totalHours') as string, 10) : 0
    };

    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || 'Gagal membuat user.' };

        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (e) {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function deleteUser(userId: number) {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${session.token}`
            }
        });

        const data = await response.json();
        if (!response.ok) return { error: data.error || 'Gagal menghapus user.' };

        revalidatePath('/dashboard/users');
        return { success: true };
    } catch {
        return { error: 'Gagal menghubungi server.' };
    }
}

export async function getUsers() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return [];

    try {
        const response = await fetch(`${API_URL}/admin/users`, {
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
