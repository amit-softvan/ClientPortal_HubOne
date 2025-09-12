import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Check, 
  CalendarPlus 
} from "lucide-react";
import { mockEvRecords } from "@/data/static-data";
import { format } from "date-fns";

export default function EvTracker() {
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-01-31",
  });

  const getEvStats = () => {
    const scheduled = mockEvRecords.filter(ev => ev.status === "scheduled").length;
    const completed = mockEvRecords.filter(ev => ev.status === "completed").length;
    const pendingVerification = mockEvRecords.filter(ev => ev.verificationStatus === "pending").length;
    const missed = mockEvRecords.filter(ev => ev.status === "missed").length;
    
    return { scheduled: 45, completed: 32, pendingVerification: 8, missed: 5 };
  };

  const stats = getEvStats();

  const getActionButtons = (record: any) => {
    if (record.status === "missed") {
      return (
        <Button variant="outline" size="sm" className="text-orange-600" data-testid={`button-reschedule-${record.id}`}>
          <CalendarPlus className="h-4 w-4" />
        </Button>
      );
    }
    
    if (record.status === "completed" && record.verificationStatus === "pending") {
      return (
        <div className="flex gap-1">
          <Button variant="outline" size="sm" data-testid={`button-view-ev-${record.id}`}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-green-600" data-testid={`button-verify-${record.id}`}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <Button variant="outline" size="sm" data-testid={`button-view-ev-${record.id}`}>
        <Eye className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <MainLayout title="Electronic Visit Tracker">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Electronic Visit Tracker</h1>
          <p className="page-subtitle">
            Monitor electronic visit statuses and verification progress
          </p>
        </div>

        {/* EV Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="dashboard-card p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="metric-value text-blue-500 text-2xl">{stats.scheduled}</div>
            <div className="metric-label">Scheduled</div>
          </Card>
          
          <Card className="dashboard-card p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="metric-value text-green-500 text-2xl">{stats.completed}</div>
            <div className="metric-label">Completed</div>
          </Card>
          
          <Card className="dashboard-card p-4 text-center">
            <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="metric-value text-yellow-500 text-2xl">{stats.pendingVerification}</div>
            <div className="metric-label">Pending Verification</div>
          </Card>
          
          <Card className="dashboard-card p-4 text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <div className="metric-value text-red-500 text-2xl">{stats.missed}</div>
            <div className="metric-label">Missed</div>
          </Card>

          <Card className="dashboard-card p-4">
            <div className="space-y-2">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                data-testid="input-date-start"
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                data-testid="input-date-end"
              />
              <Button className="w-full" size="sm" data-testid="button-filter-date">
                Filter by Date Range
              </Button>
            </div>
          </Card>
        </div>

        {/* EV Table */}
        <Card className="dashboard-card">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Electronic Visits</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Visit Date</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Visit Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEvRecords.map((record) => (
                    <TableRow key={record.id} data-testid={`ev-row-${record.id}`}>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{record.patientName}</div>
                          <div className="text-sm text-muted-foreground">
                            DOB: {record.dateOfBirth ? format(record.dateOfBirth, "MMM dd, yyyy") : "N/A"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(record.visitDate, "MMM dd, yyyy 'at' h:mm a")}
                      </TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell>{record.visitType}</TableCell>
                      <TableCell>
                        <StatusBadge status={record.status} />
                      </TableCell>
                      <TableCell>
                        {record.verificationStatus ? (
                          <StatusBadge status={record.verificationStatus} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {getActionButtons(record)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
