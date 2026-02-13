import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ClearanceClient from "./ClearanceClient";

export const dynamic = "force-dynamic";

const API_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api";

import { SystemSettings } from "@/types";

export default async function ClearancePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [userRes, settingsRes] = await Promise.all([
    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${session.token}` },
    }),
    fetch(`${API_URL}/admin/settings`, {
      headers: { Authorization: `Bearer ${session.token}` },
    }),
  ]);

  if (!userRes.ok) return <div>Gagal mengambil data user.</div>;

  const user = await userRes.json();
  const settings: SystemSettings[] = settingsRes.ok
    ? await settingsRes.json()
    : [];

  const bankSetting = settings.find((s) => s.key === "bank_account");
  const bankInfo =
    bankSetting?.value || "BNI 1234567890 a.n. Politeknik Negeri Jakarta";

  return (
    <ClearanceClient
      currentDebt={user.totalHours}
      userId={user.id}
      bankInfo={bankInfo}
      isLibraryClear={user.isLibraryClear}
      isAdminClear={user.isAdminClear}
      userData={{
        name: user.name || "-",
        nim: user.nim || "-",
        prodi: user.prodi || "Teknik Informatika",
        kelas: user.kelas || "-",
      }}
    />
  );
}
