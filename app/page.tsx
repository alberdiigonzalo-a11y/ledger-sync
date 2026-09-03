import { DashboardProvider } from "@/components/dashboard/dashboard-context"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default function Page() {
  return (
    <DashboardProvider>
      <DashboardShell />
    </DashboardProvider>
  )
}
