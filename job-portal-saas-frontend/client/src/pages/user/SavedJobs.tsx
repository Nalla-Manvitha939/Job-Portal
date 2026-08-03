import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Briefcase, Trash2, Building } from "lucide-react";
import { useLocation } from "wouter";

export default function SavedJobs() {
  const [, navigate] = useLocation();
  const [savedJobsList, setSavedJobsList] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) return;

    const rawSaved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");
    
    // Filter saved items belonging to the current user
    const userSavedItems = rawSaved.filter(
      (item: any) => String(item.userId) === String(currentUser.id)
    );

    // Map saved items to actual job details (handles both direct job objects and ID references)
    const resolvedJobs = userSavedItems.map((saved: any) => {
      const jobId = saved.jobId || saved.id;
      const matchedJob = allJobs.find((j: any) => String(j.id) === String(jobId));
      
      // Fallback to whatever properties exist in saved if a match isn't found in jobs list
      return matchedJob || saved;
    });

    setSavedJobsList(resolvedJobs);
  }, []);

  const handleRemove = (jobId: any) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (!currentUser) return;

    const rawSaved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
    
    // Remove the specific saved job entry for this user
    const updatedRawSaved = rawSaved.filter(
      (item: any) => {
        const matchesUser = String(item.userId) === String(currentUser.id);
        const matchesJob = String(item.id) === String(jobId) || String(item.jobId) === String(jobId);
        return !(matchesUser && matchesJob);
      }
    );

    localStorage.setItem("savedJobs", JSON.stringify(updatedRawSaved));
    
    // Update local state
    setSavedJobsList((prev) => prev.filter((job) => String(job.id) !== String(jobId)));
  };

  return (
    <div className="min-h-screen bg-background container py-8">
      <button
        onClick={() => navigate("/user/dashboard")}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Saved Jobs ({savedJobsList.length})</h1>
      </div>

      {savedJobsList.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <p>You haven't saved any jobs yet.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedJobsList.map((job) => (
            <Card key={job.id || job.jobId} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                    {job.company?.[0] || job.title?.[0] || "JP"}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(job.id || job.jobId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="font-bold text-lg mb-1">
                  {job.title || job.jobTitle || "Untitled Job"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {job.company || "Unknown Company"}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {job.experience || job.jobType || "Full-time"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {job.location || job.mode || "Remote"}
                  </div>
                  <div className="font-semibold text-accent">
                    {job.salary || "Competitive"}
                  </div>
                </div>
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => navigate(`/user/apply/${job.id || job.jobId}`)}
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
