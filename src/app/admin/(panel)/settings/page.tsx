import type { Metadata } from "next";
import SettingsForm from "@/components/admin/SettingsForm";
import { getContactInfo } from "@/server/settings";

export const metadata: Metadata = { title: "Cài đặt | LeMan", robots: { index: false } };

export default async function AdminSettingsPage() {
  const contact = await getContactInfo();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Cài đặt</h1>
      <SettingsForm contact={contact} />
    </div>
  );
}
