import AdminPwaRegister from "@/components/admin/AdminPwaRegister";

export const metadata = {
  title: {
    default: "HypeX Admin",
    template: "%s | HypeX Admin",
  },
  manifest: "/manifest-admin.json",
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: "#0b0b0b",
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-root min-h-screen bg-[#f4f4f2] text-ink font-body">
      <AdminPwaRegister />
      {children}
    </div>
  );
}
