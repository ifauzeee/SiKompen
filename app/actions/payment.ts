"use server";

import { revalidatePath } from "next/cache";

import { getSession } from "@/lib/session";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export async function createPayment(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok)
      return { error: data.error || "Gagal membuat pembayaran" };

    revalidatePath("/dashboard/finance");
    revalidatePath("/my-applications");
    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server" };
  }
}

export async function verifyPayment(
  paymentId: number,
  status: "APPROVED" | "REJECTED",
) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/payments/${paymentId}/verify`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();
    if (!response.ok)
      return { error: data.error || "Gagal memverifikasi pembayaran" };

    revalidatePath("/dashboard/finance");
    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server" };
  }
}
