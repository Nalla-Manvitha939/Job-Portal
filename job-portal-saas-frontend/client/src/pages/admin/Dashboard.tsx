import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Briefcase, Building, TrendingUp, AlertCircle, FileText } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const storedJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const storedApps = JSON.parse(localStorage.getItem("applications") || "[]");
    const storedCompanies = JSON.parse(localStorage.getItem("companyProfiles") || "[]");

    setUsers(storedUsers);
    setJobs(storedJobs);
    setApplications(storedApps);
    setCompanies(storedCompanies);
  }, []);

  const totalUsersCount = users.length;
  const activeJobsCount = jobs.filter((j) => j.status === "Active" || !j.status).length;
  
  const recruitersCount = users.filter((u) => u.role === "recruiter" || u.role === "Company").length;
  const totalCompaniesCount = companies.length > 0 ? companies.length : recruitersCount;

  const adminCards = [
    { title: "Total Users", value: totalUsersCount, icon: Users, color: "text-blue-600" },
    { title: "Active Jobs", value: activeJobsCount, icon: Briefcase, color: "text-purple-600" },
    { title: "Companies", value: totalCompaniesCount, icon: Building, color: "text-green-600" },
    { title: "Total Applications", value: applications.length, icon: TrendingUp, color: "text-orange-600" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const platformGrowthData = months.map((month, idx) => {
    const userCount = users.filter((u) => {
      if (!u.createdAt) return false;
      return new Date(u.createdAt).getMonth() === idx;
    }).length;

    const jobCount = jobs.filter((j) => {
      if (!j.createdAt) return false;
      return new Date(j.createdAt).getMonth() === idx;
    }).length;

    return { month, users: userCount, jobs: jobCount };
  });

  const applicationTrendData = months.map((month, idx) => {
    const appCount = applications.filter((app) => {
      if (!app.appliedAt && !app.createdAt) return false;
      const date = new Date(app.appliedAt || app.createdAt);
      return date.getMonth() === idx;
    }).length;

    return { month, applications: appCount };
  });

  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.appliedAt || b.createdAt || 0).getTime() - new Date(a.appliedAt || a.createdAt || 0).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Platform overview and management</p>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-6">
          {adminCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={i} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <Icon className={`w-8 h-8 ${card.color}`} />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </Card>
            );
          })}
        </div>

        
        <div className="grid md:grid-cols-2 gap-6">
          
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">User Registration Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={platformGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} name="New Users" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Applications Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="applications" fill="#3b82f6" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recent Users</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/users")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user, idx) => (
                  <div
                    key={user.id || idx}
                    className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-border/40"
                  >
                    <div className="flex-1">
                      
                      <p className="font-medium text-sm">
                        {user.fullName || user.name || user.username || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email || "No email provided"}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {user.role || "Job Seeker"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No users found in localStorage.</p>
              )}
            </div>
          </Card>

          
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Latest Applications
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/admin/applications")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((app, idx) => (
                  <div
                    key={app.id || idx}
                    className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors border border-border/40"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{app.applicantName || app.userName || app.fullName || "Applicant"}</p>
                      <p className="text-xs text-muted-foreground">{app.jobTitle || "Job Application"}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {app.status || "Pending"}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">No recent applications submitted.</p>
              )}
            </div>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <h3 className="font-bold mb-4">Management</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-12" onClick={() => navigate("/admin/users")}>
              Manage Users
            </Button>
            <Button variant="outline" className="h-12" onClick={() => navigate("/admin/companies")}>
              Manage Companies
            </Button>
            <Button variant="outline" className="h-12" onClick={() => navigate("/admin/jobs")}>
              Manage Jobs
            </Button>
            <Button variant="outline" className="h-12" onClick={() => navigate("/admin/analytics")}>
              View Analytics
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}