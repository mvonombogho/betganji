import { auth } from "@/lib/auth/auth"
import { UserProfile } from "@/components/dashboard/user-profile"
import { PerformanceStats } from "@/components/dashboard/performance-stats"
import { ActivityFeed } from "@/components/dashboard/activity-feed"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <UserProfile user={session.user} />
        </div>
        <div className="col-span-3">
          <ActivityFeed />
        </div>
      </div>
      
      <div className="grid gap-4">
        <PerformanceStats />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button className="p-4 text-left rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <h3 className="font-semibold">New Prediction</h3>
              <p className="text-sm opacity-90">Create a new match prediction</p>
            </button>
            <button className="p-4 text-left rounded-lg bg-secondary hover:bg-secondary/80">
              <h3 className="font-semibold">View Matches</h3>
              <p className="text-sm text-secondary-foreground/60">See upcoming matches</p>
            </button>
          </div>
        </div>
        
        <div className="col-span-3">
          <h2 className="text-2xl font-bold mb-4">Tips & Insights</h2>
          <div className="rounded-lg border bg-card text-card-foreground p-4">
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Best performing teams this week</li>
              <li>Top value bets based on odds analysis</li>
              <li>Recent form changes to watch</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}