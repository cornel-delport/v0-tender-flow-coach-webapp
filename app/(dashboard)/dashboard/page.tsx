import { AppHeader } from '@/components/app-header'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { ProjectCard } from '@/components/dashboard/project-card'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { ReadinessOverview } from '@/components/dashboard/readiness-overview'
import { mockProject, mockCriteria } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader 
        title="Welkom terug, Anna"
        subtitle="Hier is een overzicht van uw lopende projecten"
      />
      
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Overview */}
        <DashboardStats />

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Project */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-base font-semibold text-foreground mb-4">
                Actief Project
              </h2>
              <ProjectCard project={mockProject} criteria={mockCriteria} />
            </div>

            {/* Readiness Overview */}
            <ReadinessOverview project={mockProject} criteria={mockCriteria} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
