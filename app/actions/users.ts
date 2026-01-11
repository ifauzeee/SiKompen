"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { User } from "@prisma/client";

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

export async function createUser(formData: FormData) {
    const session = await getSession();

    if (!session || session.role !== 'ADMIN') {
        return { error: 'Unauthorized. Admin access required.' };
    }

    const rawData = {
        name: formData.get('name'),
        password: formData.get('password'),
        role: formData.get('role'),
        nim: (formData.get('nim') as string)?.trim() || undefined,
        prodi: (formData.get('prodi') as string)?.trim() || undefined,
        kelas: (formData.get('kelas') as string)?.trim() || undefined,
        username: (formData.get('username') as string)?.trim(),
        totalHours: formData.get('totalHours') ? parseInt(formData.get('totalHours') as string, 10) : 0
    };

    if (!rawData.username && rawData.nim) {
        rawData.username = rawData.nim;
    }

    const parsed = CreateUserSchema.safeParse(rawData);

    if (!parsed.success) {
        const errs = parsed.error.flatten().fieldErrors;
        return { error: Object.values(errs).flat()[0] || "Invalid data" };
    }

    const data = parsed.data;

    try {
        const existing = await prisma.user.findUnique({ where: { username: data.username } });
        if (existing) return { error: 'Username sudah terdaftar.' };

        const hashedPassword = await hashPassword(data.password);

        await prisma.user.create({
            data: {
                name: data.name,
                username: data.username,
                password: hashedPassword,
                role: data.role,
                nim: data.nim,
                prodi: data.prodi,
                kelas: data.kelas,
                totalHours: data.totalHours,
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
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return { error: 'Unauthorized' };

    if (session.userId === userId) {
        return { error: "Tidak dapat menghapus akun sendiri." };
    }

    try {
        await prisma.user.delete({ where: { id: userId } });
        revalidatePath('/dashboard/users');
        return { success: true };
    } catch {
        return { error: 'Gagal menghapus user.' };
    }
}

export async function getUsers() {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return [];

    const users = await prisma.user.findMany({
        orderBy: { role: 'asc' }
    });

    return users.map(user => {
        const { password: _password, createdAt, updatedAt, ...safeUser } = user;

        return {
            ...safeUser,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString()
        };
    }) as unknown as User[];
}
