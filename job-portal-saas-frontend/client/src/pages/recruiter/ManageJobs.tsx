import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  Plus,
  Briefcase,
  Users,
  Eye,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  employmentType: string;
  category: string;
  deadline: string;
  description: string;
  skills: string[];
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  status: string;
  applicants: number;
  createdAt: string;
}

export default function ManageJobs() {
  const [, navigate] = useLocation();
  const [jobsData, setJobsData] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    const allJobs = JSON.parse(
      localStorage.getItem("jobs") || "[]"
    );

    if (!currentUser) return;

    const recruiterJobs = allJobs.filter(
      (job: Job) => job.recruiterEmail === currentUser.email
    );

    setJobsData(recruiterJobs);
  }, []);

  
  const handleDeleteJob = (jobId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    const allJobs = JSON.parse(
      localStorage.getItem("jobs") || "[]"
    );

    const updatedJobs = allJobs.filter(
      (job: Job) => Number(job.id) !== Number(jobId)
    );

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    const recruiterJobs = updatedJobs.filter(
      (job: Job) => job.recruiterEmail === currentUser?.email
    );

    setJobsData(recruiterJobs);

    alert("Job deleted successfully.");
  };

  const jobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" || job.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [jobsData, search, status]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/recruiter/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Manage Jobs</h1>
              <p className="text-sm text-muted-foreground">
                Manage all your published jobs.
              </p>
            </div>
          </div>

          <Button
            className="btn-premium"
            onClick={() => navigate("/recruiter/post-job")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Briefcase className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Jobs</p>
            <h2 className="text-3xl font-bold">{jobsData.length}</h2>
          </Card>

          <Card className="glass-card p-6">
            <Users className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">
              Total Applicants
            </p>
            <h2 className="text-3xl font-bold">
              {jobsData.reduce((a, b) => a + (b.applicants || 0), 0)}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <Calendar className="w-8 h-8 text-orange-600 mb-3" />
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <h2 className="text-3xl font-bold">
              {jobsData.filter((j) => j.status === "Active").length}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <Briefcase className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-muted-foreground">Draft Jobs</p>
            <h2 className="text-3xl font-bold">
              {jobsData.filter((j) => j.status === "Draft").length}
            </h2>
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Draft</option>
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
                  <th className="text-left p-4 font-semibold">Location</th>
                  <th className="text-left p-4 font-semibold">Type</th>
                  <th className="text-left p-4 font-semibold">Applicants</th>
                  <th className="text-left p-4 font-semibold">Deadline</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-12 text-muted-foreground"
                    >
                      No jobs found.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{job.title}</p>
                          <p className="text-sm text-muted-foreground">
                            #{job.id}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">{job.location}</td>
                      <td className="p-4">{job.employmentType}</td>
                      <td className="p-4">{job.applicants}</td>
                      <td className="p-4">{job.deadline}</td>

                      <td className="p-4">
                        <Badge
                          className={
                            job.status === "Active"
                              ? "bg-green-500 text-white"
                              : job.status === "Draft"
                              ? "bg-yellow-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => navigate(`/recruiter/job/${job.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() =>
                              navigate(`/recruiter/edit-job/${job.id}`)
                            }
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash2 className="w-4 h-4" />
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
              <h2 className="text-lg font-semibold">Job Summary</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Displaying {jobs.length} of {jobsData.length} jobs.
              </p>
            </div>

            <Button
              className="btn-premium"
              onClick={() => navigate("/recruiter/post-job")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Another Job
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}