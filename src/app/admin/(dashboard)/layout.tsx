import { redirect } from "next/navigation";
import { AdminShell, type AdminNavItem } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/Toast";
import { getActor } from "@/lib/auth";
import { getEnquiries } from "@/lib/queries/content";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const actor = await getActor();

  if (!actor) redirect("/admin/login");

  const enquiries = await getEnquiries("new");

  const items: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/faqs", label: "FAQs" },
    { href: "/admin/team", label: "Team" },
    {
      href: "/admin/enquiries",
      label: "Enquiries",
      badge: enquiries.length > 0 ? enquiries.length : undefined,
    },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/settings", label: "Settings" },
    ...(actor.profile.role === "admin"
      ? [{ href: "/admin/users", label: "Users" }]
      : []),
  ];

  return (
    <ToastProvider>
      <AdminShell
        items={items}
        userName={actor.profile.full_name ?? actor.user.email ?? "Signed in"}
        userRole={actor.profile.role}
      >
        {children}
      </AdminShell>
    </ToastProvider>
  );
}
