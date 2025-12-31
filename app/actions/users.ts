"use server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "./auth";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized. Admin access required.' };
    }

    const name = (formData.get('name') as string).trim();
    const password = (formData.get('password') as string).trim();
    const role = (formData.get('role') as string).trim();

    const nim = (formData.get('nim') as string)?.trim() || null;
    const prodi = (formData.get('prodi') as string)?.trim() || null;
    const kelas = (formData.get('kelas') as string)?.trim() || null;

    let username = (formData.get('username') as string)?.trim();
    if (!username && nim) {
        username = nim;
    }

    console.log('Raw totalHours:', formData.get('totalHours'));

    let totalHours = 0;
    if (role === 'MAHASISWA') {
        const rawHours = formData.get('totalHours');
        if (rawHours) {
            totalHours = parseInt(rawHours.toString(), 10);
        }
    }

    console.log('Parsed totalHours:', totalHours);

    if (!name || !username || !password || !role) {
        return { error: 'Nama, Username, Password, dan Role wajib diisi.' };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { username } });
        if (existing) return { error: 'Username sudah terdaftar.' };

        await prisma.user.create({
            data: {
                name,
                username,
                password,
                role,
                nim,
                prodi,
                kelas,
                totalHours: totalHours
            }
        });

        revalidatePath('/dashboard/users');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: 'Gagal membuat user.' };
    }
}

export async function deleteUser(userId: number) {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') return { error: 'Unauthorized' };

    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch {
        return { error: 'Gagal menghapus user.' };
    }
}

export async function getUsers() {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') return [];

    return await prisma.user.findMany({
        orderBy: { role: 'asc' }
    });
}
