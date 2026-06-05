"use client"

import { AdminDashboard } from "@/components/admin/screens/admin-dashboard"
import { AdminLoadingScreen } from "@/components/admin/screens/admin-loading-screen"
import { AdminLoginScreen } from "@/components/admin/screens/admin-login-screen"
import { useAdminCms } from "@/components/admin/use-admin-cms"

export default function AdminPage() {
  const cms = useAdminCms()

  if (!cms.authReady) {
    return <AdminLoadingScreen mounted={cms.mounted} loaderColor={cms.loaderColor} />
  }

  if (!cms.user) {
    return <AdminLoginScreen cms={cms} />
  }

  return <AdminDashboard cms={cms} />
}
