import { MainLayout } from "@/components/layout/main-layout";
import { MetricCard } from "@/components/ui/metric-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Clock, 
  ClipboardList, 
  CheckCircle, 
  Calendar 
} from "lucide-react";
import { dashboardMetrics, mockQueueItems } from "@/data/static-data";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const recentQueueItems = mockQueueItems.slice(0, 3);

  return (
    <MainLayout title="Dashboard">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            Overview of your clinic's performance and pending tasks
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            value={dashboardMetrics.pendingQueueItems}
            label="Pending Queue Items"
            icon={<Clock className="text-yellow-500" />}
            data-testid="metric-pending-queue"
          />
          <MetricCard
            value={dashboardMetrics.paSubmitted}
            label="PA Submitted"
            icon={<ClipboardList className="text-blue-500" />}
            data-testid="metric-pa-submitted"
          />
          <MetricCard
            value={dashboardMetrics.paApproved}
            label="PA Approved"
            icon={<CheckCircle className="text-green-500" />}
            data-testid="metric-pa-approved"
          />
          <MetricCard
            value={dashboardMetrics.evCompleted}
            label="EV Completed"
            icon={<Calendar className="text-purple-500" />}
            data-testid="metric-ev-completed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Recent Queue Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Task Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentQueueItems.map((item) => (
                        <TableRow key={item.id} data-testid={`activity-row-${item.id}`}>
                          <TableCell>
                            <div>
                              <div className="font-semibold">{item.patientName}</div>
                              <div className="text-sm text-muted-foreground">
                                {item.accountNumber}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.program}</TableCell>
                          <TableCell>
                            <StatusBadge status={item.status} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDistanceToNow(item.updatedAt, { addSuffix: true })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PA Status Overview */}
          <div>
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">PA Status Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Approved ({dashboardMetrics.paStats.approved.percentage}%)
                    </span>
                    <span className="text-sm font-semibold">
                      {dashboardMetrics.paStats.approved.count}
                    </span>
                  </div>
                  <Progress 
                    value={dashboardMetrics.paStats.approved.percentage} 
                    className="h-2"
                    data-testid="progress-approved"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Pending ({dashboardMetrics.paStats.pending.percentage}%)
                    </span>
                    <span className="text-sm font-semibold">
                      {dashboardMetrics.paStats.pending.count}
                    </span>
                  </div>
                  <Progress 
                    value={dashboardMetrics.paStats.pending.percentage} 
                    className="h-2"
                    data-testid="progress-pending"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      Denied ({dashboardMetrics.paStats.denied.percentage}%)
                    </span>
                    <span className="text-sm font-semibold">
                      {dashboardMetrics.paStats.denied.count}
                    </span>
                  </div>
                  <Progress 
                    value={dashboardMetrics.paStats.denied.percentage} 
                    className="h-2"
                    data-testid="progress-denied"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
