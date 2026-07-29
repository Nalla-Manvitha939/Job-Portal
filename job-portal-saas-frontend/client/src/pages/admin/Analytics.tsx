import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Users,
  Briefcase,
  Building,
  DollarSign,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticsPage() {
  const [, navigate] = useLocation();

  
  const [users, setUsers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  
  useEffect(() => {
    const loadData = () => {
      setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
      setJobs(JSON.parse(localStorage.getItem("jobs") || "[]"));
      setApplications(JSON.parse(localStorage.getItem("applications") || "[]"));

      const company = JSON.parse(
        localStorage.getItem("companyProfile") || "null"
      );
      setCompanies(company ? [company] : []);
    };

    loadData();

    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, []);

  
  const totalUsers = users.length;

  
  const totalRecruiters = users.filter((u) => {
    const role = (u.role || "").toLowerCase();
    return role === "recruiter";
  }).length;

  const jobSeekersCount = users.filter((u) => {
    const role = (u.role || "").toLowerCase();
    return role === "user" || role === "jobseeker" || !role;
  }).length;

  const adminCount = users.filter((u) => {
    const role = (u.role || "").toLowerCase();
    return role === "admin";
  }).length;

  const activeJobs = jobs.filter((job) => job.status !== "Closed").length;
  const totalApplications = applications.length;
  const revenue = totalRecruiters * 199;

  const currentMonthIdx = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const newUsers = users.filter((u) => {
    if (!u.createdAt) return true; 
    const date = new Date(u.createdAt);
    return date.getMonth() === currentMonthIdx && date.getFullYear() === currentYear;
  }).length;

  const GROWTH_DATA = MONTHS.map((month, idx) => {
    const monthUsers = users.filter((u) => {
      if (!u.createdAt) return idx === currentMonthIdx;
      return new Date(u.createdAt).getMonth() === idx;
    }).length;

    const monthJobs = jobs.filter((j) => {
      if (!j.createdAt) return idx === currentMonthIdx;
      return new Date(j.createdAt).getMonth() === idx;
    }).length;

    const monthRecruiters = users.filter((u) => {
      const role = (u.role || "").toLowerCase();
      if (role !== "recruiter") return false;
      if (!u.createdAt) return idx === currentMonthIdx;
      return new Date(u.createdAt).getMonth() === idx;
    }).length;

    return {
      month,
      users: monthUsers,
      jobs: monthJobs,
      recruiters: monthRecruiters,
    };
  });

  const APPLICATION_DATA = MONTHS.map((month, idx) => {
    const monthApps = applications.filter((app) => {
      if (!app.createdAt && !app.appliedAt) return idx === currentMonthIdx;
      const appDate = new Date(app.createdAt || app.appliedAt);
      return appDate.getMonth() === idx;
    }).length;

    return {
      month,
      applications: monthApps,
    };
  });

  const prevMonthIdx = (currentMonthIdx - 1 + 12) % 12;
  const prevMonthRevenue = GROWTH_DATA[prevMonthIdx].recruiters * 199;
  const currentMonthRevenue = GROWTH_DATA[currentMonthIdx].recruiters * 199;

  let revenueGrowthPct = 0;
  if (prevMonthRevenue > 0) {
    revenueGrowthPct = Math.round(((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100);
  } else if (currentMonthRevenue > 0) {
    revenueGrowthPct = 100;
  }

  const USER_DISTRIBUTION = [
    { name: "Job Seekers", value: jobSeekersCount },
    { name: "Recruiters", value: totalRecruiters },
    { name: "Admins", value: adminCount },
  ];

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
              <h1 className="text-2xl font-bold">Platform Analytics</h1>
              <p className="text-sm text-muted-foreground">
                Monitor platform performance and business insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h2 className="text-3xl font-bold">{totalUsers}</h2>
            <p className="text-xs text-green-600 mt-2">+12% this month</p>
          </Card>

          <Card className="glass-card p-6">
            <Briefcase className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <h2 className="text-3xl font-bold">{activeJobs}</h2>
            <p className="text-xs text-green-600 mt-2">+18% this month</p>
          </Card>

          <Card className="glass-card p-6">
            <Building className="w-8 h-8 text-orange-600 mb-3" />
            <p className="text-sm text-muted-foreground">Recruiters</p>
            <h2 className="text-3xl font-bold">{totalRecruiters}</h2>
            <p className="text-xs text-green-600 mt-2">+9% this month</p>
          </Card>

          <Card className="glass-card p-6">
            <DollarSign className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">Revenue</p>
            <h2 className="text-3xl font-bold">₹{revenue.toLocaleString()}</h2>
            <p className="text-xs text-green-600 mt-2">+22% this month</p>
          </Card>
        </div>

        
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Platform Growth</h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={GROWTH_DATA}>
                <defs>
                  <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#3b82f6"
                  fill="url(#growth)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Monthly Applications</h3>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={APPLICATION_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="applications"
                  radius={[8, 8, 0, 0]}
                  fill="#8b5cf6"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        
        <div className="grid lg:grid-cols-3 gap-6">
          
          <Card className="glass-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">User Distribution</h3>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={USER_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {USER_DISTRIBUTION.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          
          <Card className="glass-card p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Platform Performance</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-background/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Job Success Rate
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {jobs.length
                    ? `${Math.round((activeJobs / jobs.length) * 100)}%`
                    : "0%"}
                </h2>
                <p className="text-sm text-green-600 mt-3">
                  ▲ 5% compared to last month
                </p>
              </div>

              <div className="rounded-xl border bg-background/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Recruiter Satisfaction
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {companies.length ? "5 / 5" : "0 / 5"}
                </h2>
                <p className="text-sm text-green-600 mt-3">
                  ▲ Positive feedback trend
                </p>
              </div>

              <div className="rounded-xl border bg-background/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Average Hiring Time
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {applications.length ? "7 Days" : "--"}
                </h2>
                <p className="text-sm text-green-600 mt-3">▼ 2 days faster</p>
              </div>

              <div className="rounded-xl border bg-background/50 p-5">
                <p className="text-sm text-muted-foreground">
                  Platform Uptime
                </p>
                <h2 className="text-3xl font-bold mt-2">100%</h2>
                <p className="text-sm text-green-600 mt-3">
                  Stable performance
                </p>
              </div>
            </div>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Monthly Highlights</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">New Users</p>
              <h2 className="text-2xl font-bold mt-2">{newUsers}</h2>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">Jobs Posted</p>
              <h2 className="text-2xl font-bold mt-2">{jobs.length}</h2>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">Applications</p>
              <h2 className="text-2xl font-bold mt-2">{totalApplications}</h2>
            </div>

            <div className="rounded-xl border p-5">
              <p className="text-sm text-muted-foreground">Revenue Growth</p>
              <h2 className="text-2xl font-bold mt-2">
                {revenueGrowthPct}%
              </h2>
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Analytics Summary</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Platform growth continues with strong user acquisition,
                increasing recruiter engagement, and consistent application
                activity.
              </p>
            </div>

            <Button onClick={() => navigate("/admin/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}