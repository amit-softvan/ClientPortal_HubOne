import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  FileSpreadsheet, 
  FileText, 
  PieChart, 
  BarChart3, 
  Calendar, 
  Play 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  reportType: string;
}

function ReportCard({ title, description, icon, reportType }: ReportCardProps) {
  const { toast } = useToast();

  const downloadReport = (format: 'excel' | 'pdf') => {
    toast({
      title: `Downloading ${title}`,
      description: `Preparing ${format.toUpperCase()} report for download...`,
    });
    
    // Simulate download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${title} report downloaded successfully!`,
      });
    }, 2000);
  };

  return (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{description}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full" 
            onClick={() => downloadReport('excel')}
            data-testid={`button-download-${reportType}-excel`}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => downloadReport('pdf')}
            data-testid={`button-download-${reportType}-pdf`}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Reports() {
  const { toast } = useToast();
  const [customReport, setCustomReport] = useState({
    type: "",
    dateRange: "",
    filter: "",
  });

  const handleGenerateCustomReport = () => {
    if (!customReport.type || !customReport.dateRange || !customReport.filter) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields to generate a custom report.",
      });
      return;
    }

    toast({
      title: "Generating Custom Report",
      description: "Your custom report is being prepared...",
    });
  };

  const reports = [
    {
      title: "PA Summary Report",
      description: "Comprehensive overview of prior authorization submissions, approvals, and denials.",
      icon: <PieChart className="text-blue-500" />,
      reportType: "pa-summary",
    },
    {
      title: "Queue Performance",
      description: "Detailed analysis of queue completion rates and processing times.",
      icon: <BarChart3 className="text-green-500" />,
      reportType: "queue-performance",
    },
    {
      title: "EV Activity Report",
      description: "Electronic visit statistics including completion rates and verification status.",
      icon: <Calendar className="text-purple-500" />,
      reportType: "ev-activity",
    },
  ];

  return (
    <MainLayout title="Reports & Analytics">
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">
            Generate and download comprehensive reports
          </p>
        </div>

        {/* Predefined Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <ReportCard key={report.reportType} {...report} />
          ))}
        </div>

        {/* Custom Report Builder */}
        <Card className="dashboard-card">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">Custom Report Builder</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label className="text-sm font-medium">Report Type</Label>
                <Select 
                  value={customReport.type} 
                  onValueChange={(value) => setCustomReport({...customReport, type: value})}
                >
                  <SelectTrigger data-testid="select-report-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pa-analysis">PA Analysis</SelectItem>
                    <SelectItem value="queue-metrics">Queue Metrics</SelectItem>
                    <SelectItem value="ev-summary">EV Summary</SelectItem>
                    <SelectItem value="provider-performance">Provider Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Date Range</Label>
                <Select 
                  value={customReport.dateRange} 
                  onValueChange={(value) => setCustomReport({...customReport, dateRange: value})}
                >
                  <SelectTrigger data-testid="select-date-range">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30-days">Last 30 Days</SelectItem>
                    <SelectItem value="90-days">Last 90 Days</SelectItem>
                    <SelectItem value="ytd">Year to Date</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Filter By</Label>
                <Select 
                  value={customReport.filter} 
                  onValueChange={(value) => setCustomReport({...customReport, filter: value})}
                >
                  <SelectTrigger data-testid="select-filter">
                    <SelectValue placeholder="Select filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="program">Program</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerateCustomReport} data-testid="button-generate-custom">
                <Play className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
