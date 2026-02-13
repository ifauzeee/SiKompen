"use server";

import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

export async function createJob(formData: FormData) {
  const session = await getSession();
  if (!session || !["ADMIN", "PENGAWAS"].includes(session.role)) {
    return { error: "Unauthorized. Access required." };
  }

  const payload = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    hours: parseInt(formData.get("hours") as string),
    quota: parseInt(formData.get("quota") as string),
  };

  if (
    !payload.title ||
    !payload.description ||
    !payload.hours ||
    !payload.quota
  ) {
    return { error: "Semua kolom wajib diisi." };
  }

  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok)
      return { error: data.error || "Gagal membuat pekerjaan." };

    revalidatePath("/dashboard");
    revalidatePath("/jobs");
    return { success: true };
  } catch (e) {
    console.error("Create Job Error:", e);
    return { error: "Gagal menghubungi server." };
  }
}

export async function deleteJob(jobId: number) {
  const session = await getSession();
  if (!session || !["ADMIN", "PENGAWAS"].includes(session.role))
    return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) return { error: data.error || "Gagal menghapus data." };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/my-jobs");
    return { success: true };
  } catch (error) {
    console.error("Delete Job Error:", error);
    return { error: "Gagal menghubungi server." };
  }
}

export async function updateJob(id: number, formData: FormData) {
  const session = await getSession();
  if (!session || !["ADMIN", "PENGAWAS"].includes(session.role)) {
    return { error: "Unauthorized" };
  }

  const payload = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    hours: parseInt(formData.get("hours") as string),
    quota: parseInt(formData.get("quota") as string),
  };

  try {
    const response = await fetch(`${API_URL}/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok)
      return { error: data.error || "Gagal mengupdate pekerjaan." };

    revalidatePath("/dashboard/my-jobs");
    revalidatePath("/jobs");
    return { success: true };
  } catch {
    return { error: "Gagal menghubungi server." };
  }
}

export async function toggleJobStatus(jobId: number, _currentStatus: string) {
  const session = await getSession();
  if (!session || !["ADMIN", "PENGAWAS"].includes(session.role))
    return { error: "Unauthorized" };

  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    });

    const data = await response.json();
    if (!response.ok) return { error: data.error || "Gagal mengubah status." };

    revalidatePath("/dashboard/my-jobs");
    revalidatePath("/jobs");
    return { success: true, newStatus: data.status };
  } catch {
    return { error: "Gagal menghubungi server." };
  }
}
