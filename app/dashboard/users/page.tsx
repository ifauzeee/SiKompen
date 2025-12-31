import { getUsers } from "@/app/actions/users";
import { getSessionUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import UserManagementClient from "./UserManagementClient";

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
    const user = await getSessionUser();

    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard');
    }

    const users = await getUsers();

    return <UserManagementClient users={users} />;
}
