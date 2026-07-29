import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  FileText,
  Users,
  Briefcase,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Download,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Applicant {
  id: number;
  name: string;
  email: string;
  job: string;
  company: string;
  appliedDate: string;
  status: "Pending" | "Reviewed" | "Shortlisted" | "Rejected";
}

const APPLICANTS: Applicant[] = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@gmail.com",
    job: "Frontend Developer",
    company: "TechNova",
    appliedDate: "Today",
    status: "Pending",
  },
  {
    id: 2,
    name: "Anjali Verma",
    email: "anjali@gmail.com",
    job: "Backend Engineer",
    company: "CloudSoft",
    appliedDate: "Yesterday",
    status: "Reviewed",
  },
  {
    id: 3,
    name: "Kiran Kumar",
    email: "kiran@gmail.com",
    job: "UI/UX Designer",
    company: "NextGen AI",
    appliedDate: "2 days ago",
    status: "Shortlisted",
  },
  {
    id: 4,
    name: "Priya Reddy",
    email: "priya@gmail.com",
    job: "Java Developer",
    company: "FinStack",
    appliedDate: "3 days ago",
    status: "Rejected",
  },
];

export default function ApplicantsPage() {
  const [, navigate] = useLocation();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplicants = useMemo(() => {
    return APPLICANTS.filter((applicant) => {
      const matchesSearch =
        applicant.name.toLowerCase().includes(search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(search.toLowerCase()) ||
        applicant.job.toLowerCase().includes(search.toLowerCase()) ||
        applicant.company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  return (
    <div className="min-h-screen bg-background">

      {}

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
                Manage Applications
              </h1>

              <p className="text-sm text-muted-foreground">
                Review and monitor applications submitted across the platform.
              </p>

            </div>

          </div>

        </div>

      </div>

      <div className="container py-8 space-y-8">

        

        <div className="grid md:grid-cols-4 gap-6">

          <Card className="glass-card p-6">

            <FileText className="w-8 h-8 text-blue-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Total Applications
            </p>

            <h2 className="text-3xl font-bold">
              {APPLICANTS.length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <Clock className="w-8 h-8 text-orange-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <h2 className="text-3xl font-bold">
              {APPLICANTS.filter(a => a.status === "Pending").length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Shortlisted
            </p>

            <h2 className="text-3xl font-bold">
              {APPLICANTS.filter(a => a.status === "Shortlisted").length}
            </h2>

          </Card>

          <Card className="glass-card p-6">

            <Users className="w-8 h-8 text-purple-600 mb-3" />

            <p className="text-sm text-muted-foreground">
              Active Jobs
            </p>

            <h2 className="text-3xl font-bold">
              {new Set(APPLICANTS.map(a => a.job)).size}
            </h2>

          </Card>

        </div>

        

        <Card className="glass-card p-6">

          <div className="flex flex-col md:flex-row gap-4">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

              <Input
                className="pl-10"
                placeholder="Search applicants..."
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
              <option>Reviewed</option>
              <option>Shortlisted</option>
              <option>Rejected</option>
            </select>

          </div>

        </Card>
                

        <Card className="glass-card overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="border-b bg-muted/40">

                <tr>

                  <th className="text-left p-4 font-semibold">
                    Applicant
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Job
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Company
                  </th>

                  <th className="text-left p-4 font-semibold">
                    Applied
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

                {filteredApplicants.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No applications found.
                    </td>

                  </tr>

                ) : (

                  filteredApplicants.map((applicant) => (

                    <tr
                      key={applicant.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">

                            {applicant.name.charAt(0)}

                          </div>

                          <div>

                            <p className="font-semibold">
                              {applicant.name}
                            </p>

                            <p className="text-sm text-muted-foreground">
                              {applicant.email}
                            </p>

                          </div>

                        </div>

                      </td>

                      <td className="p-4">

                        <div className="flex items-center gap-2">

                          <Briefcase className="w-4 h-4 text-muted-foreground" />

                          <span>{applicant.job}</span>

                        </div>

                      </td>

                      <td className="p-4">
                        {applicant.company}
                      </td>

                      <td className="p-4">
                        {applicant.appliedDate}
                      </td>

                      <td className="p-4">

                        <Badge
                          className={
                            applicant.status === "Pending"
                              ? "bg-yellow-500 text-white"
                              : applicant.status === "Reviewed"
                              ? "bg-blue-500 text-white"
                              : applicant.status === "Shortlisted"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {applicant.status}
                        </Badge>

                      </td>

                      <td className="p-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            size="icon"
                            variant="outline"
                            title="View Application"
                            onClick={() =>
                              console.log("View Application", applicant.id)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            title="Download Resume"
                            onClick={() =>
                              console.log("Download Resume", applicant.id)
                            }
                          >
                            <Download className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            title="Shortlist Applicant"
                            onClick={() =>
                              console.log("Shortlist", applicant.id)
                            }
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            title="Reject Application"
                            onClick={() =>
                              console.log("Reject", applicant.id)
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
                Applications Summary
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredApplicants.length} of {APPLICANTS.length} applications across all companies.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <Badge variant="secondary">
                Pending: {APPLICANTS.filter(a => a.status === "Pending").length}
              </Badge>

              <Badge variant="outline">
                Reviewed: {APPLICANTS.filter(a => a.status === "Reviewed").length}
              </Badge>

              <Badge className="bg-green-500 text-white">
                Shortlisted: {APPLICANTS.filter(a => a.status === "Shortlisted").length}
              </Badge>

              <Badge className="bg-red-500 text-white">
                Rejected: {APPLICANTS.filter(a => a.status === "Rejected").length}
              </Badge>

            </div>

          </div>

        </Card>

      </div>

    </div>

  );

}