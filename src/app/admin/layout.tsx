import type { Metadata } from "next";
import AdminLayoutClient from "@/components/admin/layout/AdminLayoutClient";

export const metadata: Metadata = {
  title: {
    default: "Admin — Mello Metallo",
    template: "%s | Admin — Mello Metallo",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
