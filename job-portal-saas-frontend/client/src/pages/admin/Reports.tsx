import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  AlertTriangle,
  ShieldAlert,
  Briefcase,
  User,
  Building,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Report {
  id: number;
  type: "Job" | "User" | "Company" | "Application";
  title: string;
  reporter: string;
  reportedAt: string;
  severity: "Low" | "Medium" | "High";
  status: "Pending" | "Resolved";
}

const REPORTS: Report[] = [
  {
    id: 1,
    type: "Job",
    title: "Suspicious Job Posting",
    reporter: "Rahul Sharma",
    reportedAt: "Today",
    severity: "High",
    status: "Pending",
  },
  {
    id: 2,
    type: "User",
    title: "Spam Recruiter Account",
    reporter: "Anjali Verma",
    reportedAt: "Yesterday",
    severity: "Medium",
    status: "Pending",
  },
  {
    id: 3,
    type: "Company",
    title: "Fake Company Profile",
    reporter: "System",
    reportedAt: "2 days ago",
    severity: "High",
    status: "Resolved",
  },
  {
    id: 4,
    type: "Application",
    title: "Duplicate Resume Submission",
    reporter: "Moderator",
    reportedAt: "3 days ago",
    severity: "Low",
    status: "Resolved",
  },
];

export default function ReportsPage() {
  const [, navigate] = useLocation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredReports = useMemo(() => {
    return REPORTS.filter((report) => {
      const matchesSearch =
        report.title.toLowerCase().includes(search.toLowerCase()) ||
        report.type.toLowerCase().includes(search.toLowerCase()) ||
        report.reporter.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const getTypeIcon = (type: Report["type"]) => {
    switch (type) {
      case "Job":
        return <Briefcase className="w-4 h-4" />;
      case "User":
        return <User className="w-4 h-4" />;
      case "Company":
        return <Building className="w-4 h-4" />;
      case "Application":
        return <FileText className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">

      

      <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">

        <div className="container py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>

              <h1 className="text-2xl font-bold">
                Reports & Moderation
              </h1>

              <p className="text-sm text-muted-foreground">
                Review flagged content and moderate platform activity.
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="container py-8 space-y-8">

        

        <div className="grid md:grid-cols-4 gap-6">

          <Card className="glass-card p-6">

            <ShieldAlert className="w-8 h-8 text-red-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Total Reports
            </p>

            <h2 className="text-3xl font-bold">
              {REPORTS.length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <Clock className="w-8 h-8 text-orange-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <h2 className="text-3xl font-bold">
              {REPORTS.filter(r => r.status === "Pending").length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Resolved
            </p>

            <h2 className="text-3xl font-bold">
              {REPORTS.filter(r => r.status === "Resolved").length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <AlertTriangle className="w-8 h-8 text-yellow-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              High Severity
            </p>

            <h2 className="text-3xl font-bold">
              {REPORTS.filter(r => r.severity === "High").length}
            </h2>

          </Card>

        </div>

        

        <Card className="glass-card p-6">

          <div className="flex flex-col md:flex-row gap-4">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

              <Input
                className="pl-10"
                placeholder="Search reports..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <select
              className="border rounded-lg px-4 py-2 bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Pending</option>
              <option>Resolved</option>
            </select>

          </div>

        </Card>
                

        <Card className="glass-card overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b bg-muted/40">

                <tr>

                  <th className="text-left p-4 font-semibold">
                    Report
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Reporter
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Reported
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Severity
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Status
                  </th>

                  <th className="text-right p-4 font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredReports.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No reports found.
                    </td>

                  </tr>

                ) : (

                  filteredReports.map((report) => (

                    <tr
                      key={report.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >

                      <td className="p-4">

                        <div className="flex items-start gap-3">

                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">

                            {getTypeIcon(report.type)}

                          </div>

                          <div>

                            <p className="font-semibold">
                              {report.title}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {report.type}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="p-4">
                        {report.reporter}
                      </td>

                      <td className="p-4">
                        {report.reportedAt}
                      </td>

                      <td className="p-4">

                        <Badge
                          className={
                            report.severity === "High"
                              ? "bg-red-500 text-white"
                              : report.severity === "Medium"
                              ? "bg-yellow-500 text-white"
                              : "bg-green-500 text-white"
                          }
                        >
                          {report.severity}
                        </Badge>

                      </td>

                      <td className="p-4">

                        <Badge
                          className={
                            report.status === "Resolved"
                              ? "bg-green-500 text-white"
                              : "bg-orange-500 text-white"
                          }
                        >
                          {report.status}
                        </Badge>

                      </td>

                      <td className="p-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            size="icon"
                            variant="outline"
                            title="Review Report"
                            onClick={() =>
                              console.log("Review", report.id)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                                                    <Button
                            size="icon"
                            variant="outline"
                            title="Resolve Report"
                            onClick={() =>
                              console.log("Resolve", report.id)
                            }
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            title="Reject Report"
                            onClick={() =>
                              console.log("Reject", report.id)
                            }
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </Card>

        

        <Card className="glass-card p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-lg font-semibold">
                Moderation Summary
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredReports.length} of {REPORTS.length} reports.
                Review pending reports regularly to maintain platform quality
                and user trust.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Badge variant="secondary">
                Pending:{" "}
                {REPORTS.filter((r) => r.status === "Pending").length}
              </Badge>

              <Badge variant="outline">
                Resolved:{" "}
                {REPORTS.filter((r) => r.status === "Resolved").length}
              </Badge>

              <Badge className="bg-red-500 text-white">
                High Severity:{" "}
                {REPORTS.filter((r) => r.severity === "High").length}
              </Badge>

            </div>

          </div>

        </Card>

      </div>

    </div>

  );

}
                            
