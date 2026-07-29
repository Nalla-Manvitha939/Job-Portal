import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Briefcase, BookmarkCheck, Calendar, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState, useMemo } from "react";

export default function UserDashboard() {
  const [, navigate] = useLocation();

  
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  
  
  const [profile, setProfile] = useState<any>(null);

  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    const rawApps = JSON.parse(localStorage.getItem("applications") || "[]");
    const rawJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    const rawSaved = JSON.parse(localStorage.getItem("savedJobs") || "[]");

    setCurrentUser(user);
    setApplications(rawApps);
    setJobs(rawJobs);
    setSavedJobs(rawSaved);

    const profiles = JSON.parse(localStorage.getItem("profiles") || "[]");
    const myProfile = profiles.find(
      (p: any) => String(p.userId) === String(user?.id)
    );
    setProfile(myProfile || null);
  }, []);

  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    return applications.filter(
      (app: any) => String(app.applicantId) === String(currentUser.id)
    );
  }, [applications, currentUser]);

  const userSavedJobsCount = useMemo(() => {
    if (!currentUser) return 0;
    return savedJobs.filter(
      (item: any) => String(item.userId) === String(currentUser.id)
    ).length;
  }, [savedJobs, currentUser]);

  const profileCompletion = useMemo(() => {
    if (!profile) return 0;

    let completed = 0;
    const total = 11;

    if (profile.firstName) completed++;
    if (profile.lastName) completed++;
    if (profile.email) completed++;
    if (profile.phone) completed++;
    if (profile.location) completed++;
    if (profile.headline) completed++;
    if (profile.bio) completed++;
    if (profile.skills?.length) completed++;
    if (profile.experience?.length) completed++;
    if (profile.education?.length) completed++;
    if (profile.resumeName) completed++;

    return Math.round((completed / total) * 100);
  }, [profile]);

  const statusData = useMemo(() => {
    return [
      {
        name: "Pending",
        value: myApplications.filter((a: any) => a.status === "Pending").length,
        color: "#3b82f6",
      },
      {
        name: "Reviewed",
        value: myApplications.filter((a: any) => a.status === "Reviewed").length,
        color: "#8b5cf6",
      },
      {
        name: "Shortlisted",
        value: myApplications.filter((a: any) => a.status === "Shortlisted").length,
        color: "#10b981",
      },
      {
        name: "Rejected",
        value: myApplications.filter((a: any) => a.status === "Rejected").length,
        color: "#ef4444",
      },
      {
        name: "Hired",
        value: myApplications.filter((a: any) => a.status === "Hired").length,
        color: "#f59e0b",
      },
    ];
  }, [myApplications]);

  
  const applicationsPerMonth = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap: Record<string, number> = {};

    myApplications.forEach((app: any) => {
      if (app.appliedAt) {
        const month = months[new Date(app.appliedAt).getMonth()];
        monthMap[month] = (monthMap[month] || 0) + 1;
      }
    });

    return months.map((m) => ({
      month: m,
      applications: monthMap[m] || 0,
    }));
  }, [myApplications]);

  
  const recentApplications = useMemo(() => {
    return [...myApplications]
      .sort((a: any, b: any) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 5);
  }, [myApplications]);

  const recommendedJobs = useMemo(() => {
    return jobs
      .filter((j: any) => j.status === "Active")
      .slice(0, 5);
  }, [jobs]);

  const DASHBOARD_CARDS = useMemo(() => {
    const shortlistedCount = myApplications.filter((a: any) => a.status === "Shortlisted").length;
    return [
      {
        title: "Total Applications",
        value: myApplications.length,
        icon: Briefcase,
        color: "text-blue-600",
      },
      {
        title: "Saved Jobs",
        value: userSavedJobsCount, 
        icon: BookmarkCheck,
        color: "text-purple-600",
      },
      {
        title: "Interview Calls",
        value: shortlistedCount,
        icon: Calendar,
        color: "text-green-600",
      },
      {
        title: "Profile Completion",
        value: `${profileCompletion}%`,
        icon: CheckCircle,
        color: "text-orange-600",
      },
    ];
  }, [myApplications, userSavedJobsCount, profileCompletion]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back! Here's your job search summary</p>
          </div>
          <Button onClick={() => navigate("/user/browse-jobs")}>
            Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      
      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          {DASHBOARD_CARDS.map((card, i) => {
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
            <h3 className="font-bold mb-4">Applications Per Month</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={applicationsPerMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="applications" stroke="var(--accent)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          
          <Card className="glass-card p-6">
            <h3 className="font-bold mb-4">Application Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData.map((entry, index) => (
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
              <h3 className="font-bold">Recent Applications</h3>
              <Button variant="ghost" size="sm" onClick={() => navigate("/user/applications")}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {recentApplications.length > 0 ? (
                recentApplications.map((app) => (
                  <div key={app.id} className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{app.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        {app.company} • {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                      </p>
                    </div>
                    <Badge variant={app.status === "Shortlisted" ? "default" : "secondary"}>
                      {app.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No applications submitted yet.</p>
              )}
            </div>
          </Card>

          
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Recommended For You</h3>
              <TrendingUp className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-3">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <div 
                    key={job.id} 
                    onClick={() => navigate(`/user/apply/${job.id}`)}
                    className="flex items-start justify-between p-3 rounded-lg bg-background/50 hover:bg-background transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{job.title}</p>
                      <p className="text-xs text-muted-foreground">{job.company}</p>
                      <p className="text-xs text-accent font-medium mt-1">{job.salary}</p>
                    </div>
                    <Badge variant="outline" className="text-accent border-accent">
                      Active
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground p-3">No recommended jobs available.</p>
              )}
            </div>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <h3 className="font-bold mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-12" onClick={() => navigate("/user/browse-jobs")}>
              Browse Jobs
            </Button>
            <Button variant="outline" className="h-12" onClick={() => navigate("/user/profile")}>
              Update Resume
            </Button>
            <Button variant="outline" className="h-12" onClick={() => navigate("/user/profile")}>
              Edit Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}