import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Building2,
  MapPin,
  IndianRupee,
  Briefcase,
  Calendar,
  Clock3,
  Users,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

interface Job {
  id: number | string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  employmentType: string;
  category?: string;
  deadline: string;
  description?: string;
  skills?: string[];
  status?: string;
}

interface Application {
  id: number | string;
  jobId: number | string;
  [key: string]: unknown;
}

export default function RecruiterJobDetails() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/recruiter/job/:id");

  const [job, setJob] = useState<Job | null>(null);
  const [applicantCount, setApplicantCount] = useState<number>(0);

  useEffect(() => {
    if (!params?.id) return;

    const jobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]");
    const selectedJob = jobs.find(
      (item) => String(item.id) === String(params.id)
    );

    setJob(selectedJob || null);

    const applicants: Application[] = JSON.parse(
      localStorage.getItem("applications") || "[]"
    );

    const totalApplicants = applicants.filter(
      (application) => String(application.jobId) === String(params.id)
    ).length;

    setApplicantCount(totalApplicants);
  }, [params]);

  const handleDelete = () => {
    if (!job) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    const jobs: Job[] = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = jobs.filter(
      (item) => String(item.id) !== String(job.id)
    );

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    navigate("/recruiter/manage-jobs");
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto flex justify-center items-center h-[70vh]">
          <Card className="p-10 text-center">
            <h2 className="text-2xl font-bold">Job Not Found</h2>
            <p className="text-muted-foreground mt-2">
              This job doesn't exist anymore.
            </p>
            <Button
              className="mt-6"
              onClick={() => navigate("/recruiter/manage-jobs")}
            >
              Back to Manage Jobs
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/recruiter/manage-jobs")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Job Details</h1>
              <p className="text-sm text-muted-foreground">
                View and manage this job posting
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>

            <Button
              variant="destructive"
              className="flex-1 md:flex-none"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        
        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">{job.title}</h2>

              <div className="flex flex-wrap gap-4 md:gap-5 mt-4 text-muted-foreground text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                  {job.company}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  {job.location}
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
                  {job.salary}
                </div>
              </div>
            </div>

            <Badge className="px-4 py-2 self-start">{job.status || "Active"}</Badge>
          </div>
        </Card>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Applicants</p>
                <h3 className="text-3xl font-bold mt-2">{applicantCount}</h3>
              </div>
              <Users className="w-10 h-10 text-blue-600" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <h3 className="text-xl font-semibold mt-2">{job.experience}</h3>
              </div>
              <Briefcase className="w-10 h-10 text-green-600" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employment</p>
                <h3 className="text-xl font-semibold mt-2">
                  {job.employmentType}
                </h3>
              </div>
              <Clock3 className="w-10 h-10 text-orange-500" />
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <h3 className="text-base font-semibold mt-2">{job.deadline}</h3>
              </div>
              <Calendar className="w-10 h-10 text-purple-600" />
            </div>
          </Card>
        </div>

        
        <div className="grid lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4 md:mb-6">Job Description</h2>
              <p className="leading-7 md:leading-8 text-muted-foreground whitespace-pre-wrap text-sm md:text-base">
                {job.description || "No description available."}
              </p>
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4 md:mb-6">Required Skills</h2>
              {job.skills && job.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {job.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-3 py-1.5 md:px-4 md:py-2"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No skills added.</p>
              )}
            </Card>

            <Card className="p-6 md:p-8">
              <h2 className="text-xl font-bold mb-4 md:mb-6">Job Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <h4 className="font-semibold mt-1">{job.company}</h4>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <h4 className="font-semibold mt-1">{job.location}</h4>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Salary</p>
                  <h4 className="font-semibold mt-1">{job.salary}</h4>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <h4 className="font-semibold mt-1">{job.experience}</h4>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Employment Type
                  </p>
                  <h4 className="font-semibold mt-1">{job.employmentType}</h4>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge className="mt-2">{job.status || "Active"}</Badge>
                </div>
              </div>
            </Card>
          </div>

          
          <div className="space-y-6">
            
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-5">Quick Actions</h3>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/recruiter/edit-job/${job.id}`)}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Job
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/recruiter/applicants")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Applicants
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/recruiter/manage-jobs")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Manage Jobs
                </Button>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Job
                </Button>
              </div>
            </Card>

            
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-5">Job Status</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Current Status</span>
                  <Badge
                    variant={
                      job.status === "Closed" ? "destructive" : "default"
                    }
                  >
                    {job.status || "Active"}
                  </Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Total Applicants
                  </span>
                  <span className="font-semibold">{applicantCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Deadline</span>
                  <span className="font-semibold">{job.deadline}</span>
                </div>
              </div>
            </Card>

            
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Eye className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />

                <div>
                  <h3 className="font-semibold text-lg">Recruiter Tips</h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-6">
                    Keep your job description detailed and your requirements up
                    to date. Jobs with clear information generally receive more
                    relevant applications.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}