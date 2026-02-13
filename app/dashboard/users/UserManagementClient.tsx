"use client";

import { useState } from "react";
import { useDialog } from "@/contexts/DialogContext";
import {
  Plus,
  Trash2,
  Search,
  User as UserIcon,
  Shield,
  GraduationCap,
  ChevronRight,
  Building,
  BookOpen,
  ArrowLeft,
  Edit,
  Wallet,
} from "lucide-react";
import { deleteUser } from "@/app/actions/users";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import EditHoursModal from "@/components/EditHoursModal";
import { User } from "@/types";

type ViewLevel = "role" | "prodi" | "kelas" | "users";

export default function UserManagementClient({ users }: { users: User[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useDialog();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editStudent, setEditStudent] = useState<User | null>(null);

  const selectedRole = searchParams.get("role");
  const selectedProdi = searchParams.get("prodi");
  const selectedKelas = searchParams.get("kelas");

  const getCurrentLevel = (): ViewLevel => {
    if (selectedKelas) return "users";
    if (selectedProdi) return "kelas";
    if (selectedRole) {
      if (selectedRole === "MAHASISWA") return "prodi";
      return "users";
    }
    return "role";
  };

  const currentLevel = getCurrentLevel();

  const roles = ["ADMIN", "PENGAWAS", "KEUANGAN", "MAHASISWA"];
  const prodis = [
    ...new Set(
      users
        .filter((u) => u.role === "MAHASISWA" && u.prodi)
        .map((u) => u.prodi),
    ),
  ];

  const getKelasForProdi = (prodi: string) => {
    return [
      ...new Set(
        users.filter((u) => u.prodi === prodi && u.kelas).map((u) => u.kelas),
      ),
    ].sort();
  };

  const getUsersForKelas = (kelas: string) => {
    return users.filter((u) => u.kelas === kelas);
  };

  const getUsersForRole = (role: string) => {
    if (role === "MAHASISWA") return [];
    return users.filter((u) => u.role === role);
  };

  const getRoleCount = (role: string) =>
    users.filter((u) => u.role === role).length;
  const getProdiCount = (prodi: string) =>
    users.filter((u) => u.prodi === prodi).length;
  const getKelasCount = (kelas: string) =>
    users.filter((u) => u.kelas === kelas).length;

  async function handleDelete(id: number) {
    setIsDeleting(true);
    const res = await deleteUser(id);
    setIsDeleting(false);
    setDeleteId(null);

    if (res?.error) showAlert(res.error, "Gagal Menghapus");
  }

  const handleRoleClick = (role: string) => {
    router.push(`/dashboard/users?role=${role}`);
  };

  const handleProdiClick = (prodi: string) => {
    router.push(
      `/dashboard/users?role=MAHASISWA&prodi=${encodeURIComponent(prodi)}`,
    );
  };

  const handleKelasClick = (kelas: string) => {
    router.push(
      `/dashboard/users?role=MAHASISWA&prodi=${encodeURIComponent(selectedProdi!)}&kelas=${encodeURIComponent(kelas)}`,
    );
  };

  const handleBack = () => {
    router.back();
  };

  const getCurrentUsers = () => {
    if (selectedKelas) {
      return getUsersForKelas(selectedKelas);
    }
    if (selectedRole && selectedRole !== "MAHASISWA") {
      return getUsersForRole(selectedRole);
    }
    return [];
  };

  const roleIcons: Record<string, React.ReactNode> = {
    ADMIN: <Shield size={24} className="text-white" />,
    PENGAWAS: <UserIcon size={24} className="text-[#008C9D]" />,
    KEUANGAN: <Wallet size={24} className="text-purple-600" />,
    MAHASISWA: <GraduationCap size={24} className="text-[#CE2029]" />,
  };

  const roleColors: Record<string, string> = {
    ADMIN:
      "bg-[#008C9D] text-white border-[#008C9D] shadow-lg shadow-[#008C9D]/20 hover:bg-[#007A8A]",
    PENGAWAS: "bg-white text-gray-900 border-[#008C9D] hover:bg-gray-50",
    KEUANGAN: "bg-white text-gray-900 border-purple-500 hover:bg-purple-50",
    MAHASISWA: "bg-white text-gray-900 border-[#CE2029] hover:bg-gray-50",
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1600px] space-y-8 px-4 pt-8 pb-12 sm:px-8">
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        isDeleting={isDeleting}
        title="Hapus Pengguna?"
        description="Pengguna yang dihapus tidak dapat dipulihkan lagi. Pastikan data sudah benar."
      />

      <EditHoursModal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        student={editStudent}
      />

      <header className="mb-4 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
            Data Pengguna
          </h1>
          <p className="text-lg font-medium text-gray-500">
            Kelola akun Admin, Pengawas, dan Mahasiswa.
          </p>
        </div>
        <Link
          href="/dashboard/users/create"
          className="flex items-center gap-2 rounded-xl bg-[#008C9D] px-6 py-3 font-bold text-white shadow-lg shadow-[#008C9D]/20 transition-colors hover:bg-[#007A8A]"
        >
          <Plus size={20} />
          <span>Tambah User</span>
        </Link>
      </header>

      {currentLevel !== "role" && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/dashboard/users"
            className="font-medium text-gray-500 hover:text-gray-900"
          >
            Semua Role
          </Link>
          {selectedRole && (
            <>
              <ChevronRight size={16} className="text-gray-400" />
              <Link
                href={`/dashboard/users?role=${selectedRole}`}
                className={`font-medium ${selectedProdi || selectedKelas ? "text-gray-500 hover:text-gray-900" : "text-gray-900"}`}
              >
                {selectedRole}
              </Link>
            </>
          )}
          {selectedProdi && (
            <>
              <ChevronRight size={16} className="text-gray-400" />
              <Link
                href={`/dashboard/users?role=MAHASISWA&prodi=${encodeURIComponent(selectedProdi)}`}
                className={`font-medium ${selectedKelas ? "text-gray-500 hover:text-gray-900" : "text-gray-900"}`}
              >
                {selectedProdi}
              </Link>
            </>
          )}
          {selectedKelas && (
            <>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="font-bold text-gray-900">{selectedKelas}</span>
            </>
          )}
        </div>
      )}

      {currentLevel !== "role" && (
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>
      )}

      {currentLevel === "role" && (
        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleClick(role)}
              className={`rounded-2xl border-2 p-8 ${roleColors[role]} group text-left transition-all`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${role === "ADMIN" ? "bg-white/20 text-white" : "bg-gray-50"}`}
                  >
                    {roleIcons[role]}
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-bold ${role === "ADMIN" ? "text-white" : "text-gray-900"}`}
                    >
                      {role}
                    </h3>
                    <p
                      className={`${role === "ADMIN" ? "text-white/80" : "text-gray-500"}`}
                    >
                      {getRoleCount(role)} pengguna
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={24}
                  className={`${role === "ADMIN" ? "text-white/50 group-hover:text-white" : "text-gray-300 group-hover:text-gray-500"} transition-colors`}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {currentLevel === "prodi" && selectedRole === "MAHASISWA" && (
        <div className="flex flex-col gap-4">
          {prodis.map((prodi) => (
            <button
              key={prodi}
              onClick={() => handleProdiClick(prodi!)}
              className="group rounded-2xl border-2 border-gray-100 bg-white p-6 text-left transition-all hover:border-green-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <Building size={20} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{prodi}</h3>
                    <p className="text-sm text-gray-500">
                      {getProdiCount(prodi!)} mahasiswa
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-300 transition-colors group-hover:text-gray-500"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {currentLevel === "kelas" && selectedProdi && (
        <div className="flex flex-col gap-4">
          {getKelasForProdi(selectedProdi).map((kelas) => (
            <button
              key={kelas}
              onClick={() => handleKelasClick(kelas!)}
              className="group rounded-2xl border-2 border-gray-100 bg-white p-6 text-left transition-all hover:border-green-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
                    <BookOpen size={20} className="text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{kelas}</h3>
                    <p className="text-sm text-gray-500">
                      {getKelasCount(kelas!)} mahasiswa
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-gray-300 transition-colors group-hover:text-gray-500"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {currentLevel === "users" && (
        <>
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <Search size={20} className="text-gray-400" />
            <input
              placeholder="Cari nama atau NIM..."
              className="flex-1 font-medium text-gray-700 outline-none placeholder:text-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-hidden overflow-x-auto rounded-[2rem] border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-left">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="p-6 text-sm font-bold text-gray-500">USER</th>
                  <th className="p-6 text-sm font-bold text-gray-500">ROLE</th>
                  <th className="p-6 text-sm font-bold text-gray-500">
                    DETAIL
                  </th>
                  <th className="p-6 text-right text-sm font-bold text-gray-500">
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {getCurrentUsers()
                  .filter(
                    (u) =>
                      u.name
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                      u.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.username
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
                  )
                  .map((user) => (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-gray-50/50"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-500">
                            {user.name?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                            user.role === "ADMIN"
                              ? "border-[#008C9D]/20 bg-[#008C9D]/10 text-[#008C9D]"
                              : user.role === "PENGAWAS"
                                ? "border-blue-100 bg-blue-50 text-blue-600"
                                : user.role === "KEUANGAN"
                                  ? "border-purple-100 bg-purple-50 text-purple-600"
                                  : "border-red-100 bg-red-50 text-[#CE2029]"
                          }`}
                        >
                          {user.role === "ADMIN" && <Shield size={12} />}
                          {user.role === "PENGAWAS" && <UserIcon size={12} />}
                          {user.role === "KEUANGAN" && <Wallet size={12} />}
                          {user.role === "MAHASISWA" && (
                            <GraduationCap size={12} />
                          )}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6">
                        {user.role === "MAHASISWA" ? (
                          <div>
                            <p className="text-sm font-medium text-gray-600">
                              NIM: {user.nim || "-"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.kelas}
                            </p>
                            <p className="text-xs font-bold text-red-500">
                              Hutang: {user.totalHours} Jam
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">-</p>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.role === "MAHASISWA" && (
                            <button
                              onClick={() => setEditStudent(user)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-500"
                              title="Edit Jam Hutang"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          {user.role !== "ADMIN" && (
                            <button
                              onClick={() => setDeleteId(user.id)}
                              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {getCurrentUsers().length === 0 && (
              <div className="p-12 text-center text-gray-400">
                Tidak ada user ditemukan.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
