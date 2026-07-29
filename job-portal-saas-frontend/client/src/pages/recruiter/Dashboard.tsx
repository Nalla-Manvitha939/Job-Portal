import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Plus,
} from "lucide-react";
import { useLocation } from "wouter";

export default function RecruiterDashboard() {
  const [, navigate] = useLocation();

  
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser) return;

    const allJobs = JSON.parse(
      localStorage.getItem("jobs") || "[]"
    );

    const recruiterJobs = allJobs.filter(
      (job: any) =>
        Number(job.recruiterId) === Number(currentUser.id)
    );

    setJobs(recruiterJobs);

    const allApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const recruiterApplications = allApplications.filter(
      (app: any) =>
        Number(app.recruiterId) === Number(currentUser.id)
    );

    setApplications(recruiterApplications);
  }, []);

  const dashboardCards = useMemo(() => {
    return [
      {
        title: "Active Jobs",
        value: jobs.filter((j) => j.status === "Active" || !j.status).length,
        icon: Briefcase,
        color: "text-blue-600",
      },
      {
        title: "Total Applicants",
        value: applications.length,
        icon: Users,
        color: "text-purple-600",
      },
      {
        title: "Pending Reviews",
        value: applications.filter((a) => a.status === "Pending").length,
        icon: FileText,
        color: "text-green-600",
      },
      {
        title: "Hired",
        value: applications.filter((a) => a.status === "Hired").length,
        icon: TrendingUp,
        color: "text-orange-600",
      },
    ];
  }, [jobs, applications]);

  
  const hiringTrend = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return months.map((month, index) => ({
      month,
      applications: applications.filter((app) => {
        if (!app.appliedAt) return false;
        const d = new Date(app.appliedAt);
        return d.getMonth() === index;
      }).length,
    }));
  }, [applications]);

  
  const applicantStatus = useMemo(() => {
    return [
      {
        name: "Pending",
        value: applications.filter((a) => a.status === "Pending").length,
        color: "#3b82f6",
      },
      {
        name: "Screening",
        value: applications.filter((a) => a.status === "Screening").length,
        color: "#8b5cf6",
      },
      {
        name: "Shortlisted",
        value: applications.filter((a) => a.status === "Shortlisted" || a.status === "Interview").length,
        color: "#10b981",
      },
      {
        name: "Rejected",
        value: applications.filter((a) => a.status === "Rejected").length,
        color: "#ef4444",
      },
    ];
  }, [applications]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Manage your job postings and applicants
            </p>
          </div>
          <Button
            className="btn-premium"
            onClick={() => navigate("/recruiter/post-job")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      
      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          {dashboardCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {card.title}
                </p>
                <p className="text-3xl font-bold">{card.value}</p>
              </Card>
            );
          })}
        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
          
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Hiring Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hiringTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--accent)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Applicant Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={applicantStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {applicantStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
          
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Job Postings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/recruiter/manage-jobs")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No job postings found.
                </p>
              ) : (
                jobs
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt || Date.now()).getTime() -
                      new Date(a.createdAt || Date.now()).getTime()
                  )
                  .slice(0, 5)
                  .map((job) => (
                    <div
                      key={job.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {
                            applications.filter(
                              (a) => String(a.jobId) === String(job.id)
                            ).length
                          }{" "}
                          applicants
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {job.status || "Active"}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </Card>

          
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Applicants</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/recruiter/applicants")}
              >
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No applicants found.
                </p>
              ) : (
                applications
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.appliedAt || Date.now()).getTime() -
                      new Date(a.appliedAt || Date.now()).getTime()
                  )
                  .slice(0, 5)
                  .map((applicant) => (
                    <div
                      key={applicant.id}
                      className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {applicant.applicantName || "Anonymous Candidate"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {applicant.jobTitle || applicant.job || "Applicant"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {applicant.appliedAt
                            ? new Date(applicant.appliedAt).toLocaleDateString()
                            : "Recently"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-accent border-accent"
                      >
                        {applicant.status || "Pending"}
                      </Badge>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate("/recruiter/post-job")}
            >
              Post New Job
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate("/recruiter/applicants")}
            >
              Review Applicants
            </Button>
            <Button
              variant="outline"
              className="h-12"
              onClick={() => navigate("/recruiter/company-profile")}
            >
              Edit Company Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}