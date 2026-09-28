import { redirect } from "next/navigation";
import { AdminShell, type AdminNavItem } from "@/components/admin/AdminShell";
import { ToastProvider } from "@/components/ui/Toast";
import { getActor } from "@/lib/auth";
import { getEnquiries } from "@/lib/queries/content";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

const setupNotice = (
  <div className="border-2 border-ink bg-paper p-6">
    <h1 className="display text-3xl">Connect Supabase to continue</h1>
    <p className="mt-3 max-w-prose text-ink-muted">
      The public site is showing its seed content. To edit anything from this panel,
      point the project at your Supabase instance.
    </p>
    <ol className="mt-5 flex max-w-prose list-decimal flex-col gap-3 pl-5">
      <li>
        Open <code className="bg-tracing px-1">.env.local</code> and replace the
        placeholder URL and keys with the values from Supabase, Project settings, API.
      </li>
      <li>
        Run <code className="bg-tracing px-1">supabase/migrations/0001_init.sql</code>{" "}
        then <code className="bg-tracing px-1">supabase/seed.sql</code> in the SQL
        editor.
      </li>
      <li>Restart the dev server and sign in at <code className="bg-tracing px-1">/admin/login</code>.</li>
    </ol>
  </div>
);

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!isSupabaseConfigured()) {
    return (
      <ToastProvider>
        <AdminShell items={[]} userName="Not connected" userRole="editor">
          {setupNotice}
        </AdminShell>
      </ToastProvider>
    );
  }

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
