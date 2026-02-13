"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession, getSession } from "@/lib/session";

const LoginSchema = z.object({
  username: z.string().min(1, "Username wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(3, "Password baru minimal 3 karakter"),
});

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export async function login(formData: FormData) {
  const rawData = {
    username: formData.get("username"),
    password: formData.get("password"),
  };

  const validatedFields = LoginSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      error:
        errors.username?.[0] || errors.password?.[0] || "Input tidak valid",
    };
  }

  const { username, password } = validatedFields.data;

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Login gagal." };
    }

    await createSession({
      userId: data.user.id,
      role: data.user.role,
      username: data.user.username,
      token: data.token,
    });
  } catch (e) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    console.error("Login error:", e);
    return { error: "Gagal menghubungi server." };
  }

  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) return null;

    return await response.json();
  } catch {
    return null;
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const validated = ChangePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });
  if (!validated.success) {
    return {
      error:
        validated.error.flatten().fieldErrors.newPassword?.[0] ||
        "Input tidak valid",
    };
  }

  try {
    const response = await fetch(`${API_URL}/users/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    if (!response.ok)
      return { error: data.error || "Gagal mengubah password." };

    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server." };
  }
}
