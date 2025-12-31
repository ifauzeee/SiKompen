"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, User as UserIcon, Shield, GraduationCap, ChevronRight, Building, BookOpen, ArrowLeft, Edit } from "lucide-react";
import { deleteUser } from "@/app/actions/users";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DeleteModal from "@/components/DeleteModal";
import EditHoursModal from "@/components/EditHoursModal";
import { User } from "@prisma/client";

type ViewLevel = 'role' | 'prodi' | 'kelas' | 'users';

export default function UserManagementClient({ users }: { users: User[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [editStudent, setEditStudent] = useState<User | null>(null);

    const selectedRole = searchParams.get('role');
    const selectedProdi = searchParams.get('prodi');
    const selectedKelas = searchParams.get('kelas');

    const getCurrentLevel = (): ViewLevel => {
        if (selectedKelas) return 'users';
        if (selectedProdi) return 'kelas';
        if (selectedRole) {
            if (selectedRole === 'MAHASISWA') return 'prodi';
            return 'users';
        }
        return 'role';
    };

    const currentLevel = getCurrentLevel();

    const roles = ['ADMIN', 'PENGAWAS', 'MAHASISWA'];
    const prodis = [...new Set(users.filter(u => u.role === 'MAHASISWA' && u.prodi).map(u => u.prodi))];

    const getKelasForProdi = (prodi: string) => {
        return [...new Set(users.filter(u => u.prodi === prodi && u.kelas).map(u => u.kelas))].sort();
    };

    const getUsersForKelas = (kelas: string) => {
        return users.filter(u => u.kelas === kelas);
    };

    const getUsersForRole = (role: string) => {
        if (role === 'MAHASISWA') return [];
        return users.filter(u => u.role === role);
    };

    const getRoleCount = (role: string) => users.filter(u => u.role === role).length;
    const getProdiCount = (prodi: string) => users.filter(u => u.prodi === prodi).length;
    const getKelasCount = (kelas: string) => users.filter(u => u.kelas === kelas).length;

    async function handleDelete(id: number) {
        setIsDeleting(true);
        const res = await deleteUser(id);
        setIsDeleting(false);
        setDeleteId(null);

        if (res?.error) alert(res.error);
    }

    const handleRoleClick = (role: string) => {
        router.push(`/dashboard/users?role=${role}`);
    };

    const handleProdiClick = (prodi: string) => {
        router.push(`/dashboard/users?role=MAHASISWA&prodi=${encodeURIComponent(prodi)}`);
    };

    const handleKelasClick = (kelas: string) => {
        router.push(`/dashboard/users?role=MAHASISWA&prodi=${encodeURIComponent(selectedProdi!)}&kelas=${encodeURIComponent(kelas)}`);
    };

    const handleBack = () => {
        router.back();
    };

    const getCurrentUsers = () => {
        if (selectedKelas) {
            return getUsersForKelas(selectedKelas);
        }
        if (selectedRole && selectedRole !== 'MAHASISWA') {
            return getUsersForRole(selectedRole);
        }
        return [];
    };

    const roleIcons: Record<string, React.ReactNode> = {
        'ADMIN': <Shield size={24} className="text-white" />,
        'PENGAWAS': <UserIcon size={24} className="text-[#008C9D]" />,
        'MAHASISWA': <GraduationCap size={24} className="text-[#CE2029]" />
    };

    const roleColors: Record<string, string> = {
        'ADMIN': 'bg-[#008C9D] text-white border-[#008C9D] shadow-lg shadow-[#008C9D]/20 hover:bg-[#007A8A]',
        'PENGAWAS': 'bg-white text-gray-900 border-[#008C9D] hover:bg-gray-50',
        'MAHASISWA': 'bg-white text-gray-900 border-[#CE2029] hover:bg-gray-50'
    };

    return (
        <div className="pt-8 px-4 sm:px-8 max-w-[1600px] mx-auto min-h-screen pb-12 space-y-8">
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

            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">Data Pengguna</h1>
                    <p className="text-gray-500 text-lg font-medium">Kelola akun Admin, Pengawas, dan Mahasiswa.</p>
                </div>
                <Link
                    href="/dashboard/users/create"
                    className="flex items-center gap-2 bg-[#008C9D] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#007A8A] transition-colors shadow-lg shadow-[#008C9D]/20"
                >
                    <Plus size={20} />
                    <span>Tambah User</span>
                </Link>
            </header>

            {currentLevel !== 'role' && (
                <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
                    <Link
                        href="/dashboard/users"
                        className="text-gray-500 hover:text-gray-900 font-medium"
                    >
                        Semua Role
                    </Link>
                    {selectedRole && (
                        <>
                            <ChevronRight size={16} className="text-gray-400" />
                            <Link
                                href={`/dashboard/users?role=${selectedRole}`}
                                className={`font-medium ${selectedProdi || selectedKelas ? 'text-gray-500 hover:text-gray-900' : 'text-gray-900'}`}
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
                                className={`font-medium ${selectedKelas ? 'text-gray-500 hover:text-gray-900' : 'text-gray-900'}`}
                            >
                                {selectedProdi}
                            </Link>
                        </>
                    )}
                    {selectedKelas && (
                        <>
                            <ChevronRight size={16} className="text-gray-400" />
                            <span className="text-gray-900 font-bold">{selectedKelas}</span>
                        </>
                    )}
                </div>
            )
            }

            {
                currentLevel !== 'role' && (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium"
                    >
                        <ArrowLeft size={18} />
                        Kembali
                    </button>
                )
            }

            {
                currentLevel === 'role' && (
                    <div className="flex flex-col gap-4">
                        {roles.map((role) => (
                            <button
                                key={role}
                                onClick={() => handleRoleClick(role)}
                                className={`p-8 rounded-2xl border-2 ${roleColors[role]} transition-all text-left group`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${role === 'ADMIN' ? 'bg-white/20 text-white' : 'bg-gray-50'}`}>
                                            {roleIcons[role]}
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold ${role === 'ADMIN' ? 'text-white' : 'text-gray-900'}`}>{role}</h3>
                                            <p className={`${role === 'ADMIN' ? 'text-white/80' : 'text-gray-500'}`}>{getRoleCount(role)} pengguna</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={24} className={`${role === 'ADMIN' ? 'text-white/50 group-hover:text-white' : 'text-gray-300 group-hover:text-gray-500'} transition-colors`} />
                                </div>
                            </button>
                        ))}
                    </div>
                )
            }

            {
                currentLevel === 'prodi' && selectedRole === 'MAHASISWA' && (
                    <div className="flex flex-col gap-4">
                        {prodis.map((prodi) => (
                            <button
                                key={prodi}
                                onClick={() => handleProdiClick(prodi!)}
                                className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-green-300 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                            <Building size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{prodi}</h3>
                                            <p className="text-sm text-gray-500">{getProdiCount(prodi!)} mahasiswa</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )
            }

            {
                currentLevel === 'kelas' && selectedProdi && (
                    <div className="flex flex-col gap-4">
                        {getKelasForProdi(selectedProdi).map((kelas) => (
                            <button
                                key={kelas}
                                onClick={() => handleKelasClick(kelas!)}
                                className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-green-300 transition-all text-left group"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                            <BookOpen size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{kelas}</h3>
                                            <p className="text-sm text-gray-500">{getKelasCount(kelas!)} mahasiswa</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                                </div>
                            </button>
                        ))}
                    </div>
                )
            }

            {
                currentLevel === 'users' && (
                    <>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex items-center gap-3">
                            <Search size={20} className="text-gray-400" />
                            <input
                                placeholder="Cari nama atau NIM..."
                                className="flex-1 outline-none font-medium text-gray-700 placeholder:text-gray-400"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-6 font-bold text-gray-500 text-sm">USER</th>
                                        <th className="p-6 font-bold text-gray-500 text-sm">ROLE</th>
                                        <th className="p-6 font-bold text-gray-500 text-sm">DETAIL</th>
                                        <th className="p-6 font-bold text-gray-500 text-sm text-right">AKSI</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {getCurrentUsers()
                                        .filter(u =>
                                            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            u.nim?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            u.username?.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .map((user) => (
                                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                            {user.name?.[0]?.toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{user.name}</p>
                                                            <p className="text-sm text-gray-400">@{user.username}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                        user.role === 'PENGAWAS' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-green-50 text-green-600 border-green-100'
                                                        }`}>
                                                        {user.role === 'ADMIN' && <Shield size={12} />}
                                                        {user.role === 'PENGAWAS' && <UserIcon size={12} />}
                                                        {user.role === 'MAHASISWA' && <GraduationCap size={12} />}
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-6">
                                                    {user.role === 'MAHASISWA' ? (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600">NIM: {user.nim || '-'}</p>
                                                            <p className="text-xs text-gray-400">{user.kelas}</p>
                                                            <p className="text-xs text-red-500 font-bold">Hutang: {user.totalHours} Jam</p>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-400">-</p>
                                                    )}
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        {user.role === 'MAHASISWA' && (
                                                            <button
                                                                onClick={() => setEditStudent(user)}
                                                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                                title="Edit Jam Hutang"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                        )}
                                                        {user.role !== 'ADMIN' && (
                                                            <button
                                                                onClick={() => setDeleteId(user.id)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
                )
            }
        </div >
    );
}
