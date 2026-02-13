"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export async function getMyNotifications(limit = 20) {
  const session = await getSession();
  if (!session) return [];

  try {
    const response = await fetch(`${API_URL}/notifications?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      next: { tags: ["notifications"] },
    });

    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function markNotificationAsRead(id: number) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) return { error: "Failed to mark as read" };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server" };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    if (!response.ok) return { error: "Failed to mark all as read" };

    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server" };
  }
}
