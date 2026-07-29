import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone,
  Download,
  Calendar,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Applicant {
  id: number;
  jobId: number;

  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;

  jobTitle: string;
  company: string;

  appliedAt: string;

  resume: string;
  resumeName: string;
  resumeType: string;

  coverLetter: string;

  recruiterId: number;
  recruiterName: string;

  status:
    | "Pending"
    | "Reviewed"
    | "Shortlisted"
    | "Interview"
    | "Rejected"
    | "Hired";
}

export default function Applicants() {
  const [, navigate] = useLocation();

  const [applications, setApplications] = useState<Applicant[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [previewResumeUrl, setPreviewResumeUrl] = useState<string | null>(null);
  const [previewCandidateName, setPreviewCandidateName] = useState<string>("");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser) return;

    const allApplications = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const recruiterApplications = allApplications.filter(
      (application: Applicant) =>
        application.recruiterId === currentUser.id
    );

    setApplications(recruiterApplications);
  }, []);

  const handleViewResume = (resumeUrl: string, candidateName: string = "Candidate") => {
    if (!resumeUrl) {
      alert("No resume available for this candidate.");
      return;
    }

    setPreviewCandidateName(candidateName);

    if (resumeUrl.startsWith("data:")) {
      try {
        const arr = resumeUrl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "application/pdf";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        setPreviewResumeUrl(blobUrl);
      } catch (err) {
        console.error("Error generating resume preview:", err);
        alert("Could not load resume preview.");
      }
    } else {
      setPreviewResumeUrl(resumeUrl);
    }
  };

  
  const handleDownloadResume = (resumeUrl: string, fileName: string = "Resume.pdf") => {
    if (!resumeUrl) return;

    const a = document.createElement("a");
    a.href = resumeUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleStatusChange = (appId: string | number, newStatus: Applicant["status"]) => {
    const allApps: Applicant[] = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const updatedApps = allApps.map((app) => {
      if (String(app.id) === String(appId)) {
        return { ...app, status: newStatus };
      }
      return app;
    });

    localStorage.setItem("applications", JSON.stringify(updatedApps));

    setApplications((prev) =>
      prev.map((app) =>
        String(app.id) === String(appId) ? { ...app, status: newStatus } : app
      )
    );
  };

  const handleScheduleInterview = (app: Applicant) => {
    if (app.status !== "Shortlisted" && app.status !== "Interview") {
      alert("Only Shortlisted candidates can be scheduled for an interview.");
      return;
    }

    const date = prompt("Enter Interview Date & Time (e.g. Oct 25, 2:00 PM):");
    if (!date) return;

    handleStatusChange(app.id, "Interview");

    const allApps: Applicant[] = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );
    const updatedWithDate = allApps.map((item) =>
      String(item.id) === String(app.id)
        ? { ...item, status: "Interview" as const, interviewDate: date }
        : item
    );
    localStorage.setItem("applications", JSON.stringify(updatedWithDate));
  };

  const filteredApplicants = useMemo(() => {
    return applications.filter((item) => {
      const name = item.applicantName || "";
      const job = item.jobTitle || "";
      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        job.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, applications]);

  const totalCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "Pending" || a.status === "Reviewed").length;
  const shortlistedCount = applications.filter((a) => a.status === "Shortlisted" || a.status === "Interview").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

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
              <h1 className="text-2xl font-bold">Applicants</h1>
              <p className="text-sm text-muted-foreground">
                Review and manage real job applicants.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Applicants</p>
            <h2 className="text-3xl font-bold">{totalCount}</h2>
          </Card>

          <Card className="glass-card p-6">
            <Clock className="w-8 h-8 text-yellow-500 mb-3" />
            <p className="text-sm text-muted-foreground">Pending / Reviewed</p>
            <h2 className="text-3xl font-bold">{pendingCount}</h2>
          </Card>

          <Card className="glass-card p-6">
            <UserCheck className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">Shortlisted / Interview</p>
            <h2 className="text-3xl font-bold">{shortlistedCount}</h2>
          </Card>

          <Card className="glass-card p-6">
            <UserX className="w-8 h-8 text-red-600 mb-3" />
            <p className="text-sm text-muted-foreground">Rejected</p>
            <h2 className="text-3xl font-bold">{rejectedCount}</h2>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search applicants by name or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="border rounded-lg px-4 py-2 bg-background text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Rejected">Rejected</option>
              <option value="Hired">Hired</option>
            </select>
          </div>
        </Card>

        
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="text-left p-4 font-semibold">Candidate</th>
                  <th className="text-left p-4 font-semibold">Applied For</th>
                  <th className="text-left p-4 font-semibold">Applied Date</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-left p-4 font-semibold">Change Status</th>
                  <th className="text-left p-4 font-semibold">View Resume</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No applicants found.
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((applicant) => (
                    <tr
                      key={applicant.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      
                      <td className="p-4">
                        <div>
                          <p className="font-semibold">{applicant.applicantName || "Anonymous Candidate"}</p>
                          <p className="text-sm text-muted-foreground">{applicant.applicantEmail}</p>
                          {applicant.applicantPhone && (
                            <p className="text-xs text-muted-foreground">{applicant.applicantPhone}</p>
                          )}
                        </div>
                      </td>

                      
                      <td className="p-4 font-medium">
                        {applicant.jobTitle || "Position"}
                      </td>

                      
                      <td className="p-4 text-sm text-muted-foreground">
                        {applicant.appliedAt
                          ? new Date(applicant.appliedAt).toLocaleDateString()
                          : "Recently"}
                      </td>

                      
                      <td className="p-4">
                        <Badge
                          className={
                            applicant.status === "Pending"
                              ? "bg-blue-500 text-white"
                              : applicant.status === "Reviewed"
                              ? "bg-yellow-500 text-white"
                              : applicant.status === "Shortlisted"
                              ? "bg-emerald-600 text-white"
                              : applicant.status === "Interview"
                              ? "bg-purple-600 text-white"
                              : applicant.status === "Rejected"
                              ? "bg-red-500 text-white"
                              : "bg-green-700 text-white"
                          }
                        >
                          {applicant.status}
                        </Badge>
                      </td>

                      
                      <td className="p-4">
                        <select
                          className="border rounded px-2 py-1 bg-background text-xs"
                          value={applicant.status}
                          onChange={(e) =>
                            handleStatusChange(
                              applicant.id,
                              e.target.value as Applicant["status"]
                            )
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </td>

                      
                      <td className="p-4">
                        {applicant.resume ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleViewResume(
                                applicant.resume,
                                applicant.applicantName || "Applicant"
                              )
                            }
                            className="flex items-center gap-2"
                          >
                            View Resume
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No Resume
                          </span>
                        )}
                      </td>

                      
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant={applicant.status === "Shortlisted" ? "default" : "outline"}
                            className={applicant.status === "Shortlisted" ? "bg-purple-600 hover:bg-purple-700" : ""}
                            title={
                              applicant.status === "Shortlisted" || applicant.status === "Interview"
                                ? "Schedule Interview"
                                : "Only Shortlisted candidates can be interviewed"
                            }
                            disabled={applicant.status !== "Shortlisted" && applicant.status !== "Interview"}
                            onClick={() => handleScheduleInterview(applicant)}
                          >
                            <Calendar className="w-4 h-4" />
                          </Button>

                          {applicant.applicantEmail && (
                            <a href={`mailto:${applicant.applicantEmail}`}>
                              <Button
                                size="icon"
                                variant="outline"
                                title="Email Candidate"
                              >
                                <Mail className="w-4 h-4" />
                              </Button>
                            </a>
                          )}

                          {applicant.applicantPhone && (
                            <a href={`tel:${applicant.applicantPhone}`}>
                              <Button
                                size="icon"
                                variant="outline"
                                title="Call Candidate"
                              >
                                <Phone className="w-4 h-4" />
                              </Button>
                            </a>
                          )}

                          <Button
                            size="icon"
                            variant="outline"
                            title="Download Resume"
                            onClick={() =>
                              handleDownloadResume(
                                applicant.resume,
                                `${applicant.applicantName || "Applicant"}_Resume.pdf`
                              )
                            }
                          >
                            <Download className="w-4 h-4" />
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
              <h2 className="text-lg font-semibold">Recruitment Summary</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredApplicants.length} of {applications.length} total applicants.
              </p>
            </div>
            <Button
              className="btn-premium"
              onClick={() => navigate("/recruiter/manage-jobs")}
            >
              View Job Postings
            </Button>
          </div>
        </Card>
      </div>

      
      {previewResumeUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-5xl h-[95vh] flex flex-col shadow-2xl">
            
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background">
              <h3 className="text-lg font-semibold">
                Resume Preview — {previewCandidateName}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setPreviewResumeUrl(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            
            <div className="flex-1 overflow-auto bg-muted/10">
              <iframe
                src={previewResumeUrl}
                title="Resume Viewer"
                className="w-full h-full border-0"
                style={{
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}