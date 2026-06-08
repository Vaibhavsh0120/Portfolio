"use client"

import { AdminDashboard } from "@/components/admin/screens/admin-dashboard"
import { AdminLoadingScreen } from "@/components/admin/screens/admin-loading-screen"
import { AdminLoginScreen } from "@/components/admin/screens/admin-login-screen"
import { useAdminCms } from "@/components/admin/core/use-admin-cms"

export default function AdminPage() {
  const cms = useAdminCms()

  if (!cms.authReady) {
    return <AdminLoadingScreen />
  }

  if (!cms.user) {
    return <AdminLoginScreen cms={cms} />
  }

  return <AdminDashboard cms={cms} />
}
