import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Share2, Bookmark, BookmarkCheck } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";

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

const RELATED_JOBS = [
  { id: 2, title: "Full Stack Developer", company: "TechCorp", salary: "$110k-$150k" },
  { id: 3, title: "Frontend Engineer", company: "StartupXYZ", salary: "$100k-$140k" },
  { id: 4, title: "React Developer", company: "DesignStudio", salary: "$90k-$130k" },
];

export default function JobDetails() {
  const [, navigate] = useLocation();

const [, params] = useRoute("/user/job/:id");

const [saved, setSaved] = useState(false);

const [job, setJob] = useState<Job | null>(null);
useEffect(() => {
  const jobs = JSON.parse(
    localStorage.getItem("jobs") || "[]"
  );

  const selectedJob = jobs.find(
    (j: Job) => j.id === Number(params?.id)
  );

  if (selectedJob) {
    setJob(selectedJob);
  }
}, [params]);
if (!job) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}


  

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4">
          <button
            onClick={() => navigate("/user/browse-jobs")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Browse Jobs
          </button>
        </div>
      </div>

      
      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="glass-card p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent text-xl">
                    {job.company.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{job.company}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge>{job.employmentType}</Badge>
                      <Badge variant="secondary">{job.location}</Badge>
                      <Badge variant="outline">{job.experience}</Badge>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSaved(!saved)}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  {saved ? (
                    <BookmarkCheck className="w-6 h-6 text-accent" />
                  ) : (
                    <Bookmark className="w-6 h-6" />
                  )}
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Salary</p>
                  <p className="font-semibold">{job.salary}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Posted</p>
                  <p className="font-semibold">{job.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Applicants</p>
                  <p className="font-semibold">{job.applicants}</p>
                </div>
              </div>
            </Card>

            
            <Card className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-4">Job Description</h2>
              <p className="text-muted-foreground mb-6">{job.description}</p>



              

              
            </Card>

            
            <Card className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="px-4 py-2">
                 {skill}
                </Badge>
                  ))}
              </div>
            </Card>

            
            

            
            <Card className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Related Opportunities</h2>
              <div className="space-y-4">
                {RELATED_JOBS.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 hover:bg-background transition-colors cursor-pointer">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-accent">{job.salary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          
          <div className="lg:col-span-1">
            <Card className="glass-card p-6 space-y-4 sticky top-24">
              <Button className="w-full btn-premium"onClick={() => navigate(`/user/apply/${job.id}`)}
>               Apply Now
              </Button>

              <Button variant="outline" className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share Job
              </Button>

              <Separator />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Application Deadline</p>
                  <p className="font-semibold">{job.deadline}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Job Type</p>
                  <p className="font-semibold">{job.employmentType}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Experience Level</p>
                  <p className="font-semibold">{job.experience}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Work Mode</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
              </div>

              <Separator />

              <div className="bg-accent/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Match Score</p>
                <p className="text-2xl font-bold text-accent">92%</p>
                <p className="text-xs text-muted-foreground mt-2">Based on your profile and skills</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
