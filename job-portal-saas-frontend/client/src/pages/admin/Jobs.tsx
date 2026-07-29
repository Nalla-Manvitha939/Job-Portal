import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function JobsPage() {
  const [, navigate] = useLocation();

  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadData = () => {
      const jobsData = JSON.parse(localStorage.getItem("jobs") || "[]");
      const applicationsData = JSON.parse(
        localStorage.getItem("applications") || "[]"
      );

      setJobs(jobsData);
      setApplications(applicationsData);
    };

    loadData();

    window.addEventListener("storage", loadData);

    return () => window.removeEventListener("storage", loadData);
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        (job.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (job.company || "").toLowerCase().includes(search.toLowerCase()) ||
        (job.location || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (job.status || "Active") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [jobs, search, statusFilter]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
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
              <h1 className="text-2xl font-bold">Manage Jobs</h1>
              <p className="text-sm text-muted-foreground">
                Review and manage all job postings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Briefcase className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <h2 className="text-3xl font-bold">{jobs.length}</h2>
          </Card>

          <Card className="glass-card p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <h2 className="text-3xl font-bold">
              {jobs.filter((job) => (job.status || "Active") === "Active").length}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <XCircle className="w-8 h-8 text-red-600 mb-3" />
            <p className="text-sm text-muted-foreground">Closed Jobs</p>
            <h2 className="text-3xl font-bold">
              {jobs.filter((job) => job.status === "Closed").length}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <Building className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Applications</p>
            <h2 className="text-3xl font-bold">{applications.length}</h2>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search jobs..."
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
              <option>Active</option>
              <option>Closed</option>
            </select>
          </div>
        </Card>

        
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="text-left p-4 font-semibold">Job</th>
                  <th className="text-left p-4 font-semibold">Company</th>
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Applicants</th>
                  <th className="text-left p-4 font-semibold">Posted</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => {
                    const applicantCount = applications.filter(
                      (app) => String(app.jobId) === String(job.id)
                    ).length;

                    return (
                      <tr
                        key={job.id}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <p className="font-semibold">{job.title}</p>
                            <Badge variant="outline" className="mt-2">
                              {job.type}
                            </Badge>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-muted-foreground" />
                            <span>{job.company}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{job.location}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge variant="secondary">
                            {applicantCount} Applicants
                          </Badge>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {job.createdAt
                                ? new Date(job.createdAt).toLocaleDateString()
                                : "-"}
                            </span>
                          </div>
                        </td>

                        <td className="p-4">
                          <Badge
                            className={
                              (job.status || "Active") === "Active"
                                ? "bg-green-500 text-white"
                                : "bg-red-500 text-white"
                            }
                          >
                            {job.status || "Active"}
                          </Badge>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              title="View Job"
                              onClick={() => console.log("View Job", job.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="outline"
                              title="Edit Job"
                              onClick={() => console.log("Edit Job", job.id)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="destructive"
                              title="Delete Job"
                              onClick={() => console.log("Delete Job", job.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Job Management Summary</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredJobs.length} of {jobs.length} job postings.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">
                Active:{" "}
                {
                  jobs.filter((job) => (job.status || "Active") === "Active")
                    .length
                }
              </Badge>

              <Badge variant="outline">
                Closed: {jobs.filter((job) => job.status === "Closed").length}
              </Badge>

              <Badge>Applications: {applications.length}</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}