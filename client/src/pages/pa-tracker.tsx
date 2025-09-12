import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { MetricCard } from "@/components/ui/metric-card";
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
  ClipboardList, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Eye, 
  RotateCcw 
} from "lucide-react";
import { mockPaRequests, dashboardMetrics } from "@/data/static-data";
import { format } from "date-fns";

export default function PaTracker() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRequests = mockPaRequests.filter(request =>
    request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionButtons = (request: any) => {
    if (request.status === "denied") {
      return (
        <div className="flex gap-1">
          <Button variant="outline" size="sm" data-testid={`button-view-${request.id}`}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="text-orange-600" data-testid={`button-resubmit-${request.id}`}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <Button variant="outline" size="sm" data-testid={`button-view-${request.id}`}>
        <Eye className="h-4 w-4" />
      </Button>
    );
  };

  return (
    <MainLayout title="Prior Authorization Tracker">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Prior Authorization Tracker</h1>
          <p className="page-subtitle">
            Real-time tracking of PA requests and status updates
          </p>
        </div>

        {/* PA Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            value={dashboardMetrics.paSubmitted}
            label="Total Submitted"
            icon={<ClipboardList className="text-blue-500" />}
          />
          <MetricCard
            value={dashboardMetrics.paApproved}
            label="Approved"
            icon={<CheckCircle className="text-green-500" />}
          />
          <MetricCard
            value={dashboardMetrics.paStats.denied.count}
            label="Denied"
            icon={<XCircle className="text-red-500" />}
          />
          <MetricCard
            value={dashboardMetrics.paStats.pending.count}
            label="Pending"
            icon={<Clock className="text-yellow-500" />}
          />
        </div>

        {/* PA Filter and Table */}
        <Card className="dashboard-card">
          <CardHeader className="border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-xl">
                Prior Authorization Requests
              </CardTitle>
              <div className="flex items-center gap-2 max-w-sm">
                <Input
                  placeholder="Search by patient name or account..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                  data-testid="input-search-pa"
                />
                <Button variant="outline" size="sm" data-testid="button-search-pa">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Submitted Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Denial Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} data-testid={`pa-row-${request.id}`}>
                      <TableCell className="font-semibold">
                        {request.patientName}
                      </TableCell>
                      <TableCell>{request.accountNumber}</TableCell>
                      <TableCell>{request.payer}</TableCell>
                      <TableCell>
                        {format(request.submittedDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={request.status} />
                      </TableCell>
                      <TableCell>
                        {request.denialReason || "-"}
                      </TableCell>
                      <TableCell>
                        {getActionButtons(request)}
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
