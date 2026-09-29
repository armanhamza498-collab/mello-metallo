"use client";

import { useState } from "react";
import { Shield, Plus, Trash2 } from "lucide-react";

const SEED_USERS = [
  { _id: "u1", name: "Super Admin", email: "admin@mellometallo.com", role: "superadmin", status: "Active" },
  { _id: "u2", name: "Store Manager", email: "manager@mellometallo.com", role: "admin", status: "Active" },
];

export default function AdminUsersSettingsPage() {
  const [users, setUsers] = useState(SEED_USERS);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif text-[--admin-text]">Admin Users & Roles</h1>
          <p className="text-xs font-sans text-[--admin-text-muted] mt-1">
            Manage admin panel users, staff access, and permission roles
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-[--admin-surface] border-[--admin-border] overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[--admin-border] bg-[--admin-surface-2] text-[--admin-text-muted]">
              <th className="p-4 font-sans font-medium uppercase">User</th>
              <th className="p-4 font-sans font-medium uppercase">Email</th>
              <th className="p-4 font-sans font-medium uppercase">Role</th>
              <th className="p-4 font-sans font-medium uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[--admin-border]">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="p-4 font-medium text-[--admin-text] flex items-center gap-2">
                  <Shield size={14} className="text-brass" /> {u.name}
                </td>
                <td className="p-4 text-[--admin-text-muted]">{u.email}</td>
                <td className="p-4 font-mono uppercase text-brass font-semibold text-[10px]">{u.role}</td>
                <td className="p-4 font-semibold text-success text-[10px]">{u.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
