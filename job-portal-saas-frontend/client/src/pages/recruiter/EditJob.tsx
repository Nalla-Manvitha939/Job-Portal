import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import {
  ArrowLeft,
  Save,
  Trash2,
  RotateCcw,
  Plus,
  X,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JobForm {
  id?: number | string;
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  employmentType: string;
  category: string;
  deadline: string;
  description: string;
  skills?: string[];
  status?: string;
}

const DEFAULT_JOB: JobForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  experience: "",
  employmentType: "",
  category: "",
  deadline: "",
  description: "",
};

export default function EditJob() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/recruiter/edit-job/:id");

  const jobId = params?.id;

  const [job, setJob] = useState<JobForm>(DEFAULT_JOB);
  const [initialJob, setInitialJob] = useState<JobForm>(DEFAULT_JOB);

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [initialSkills, setInitialSkills] = useState<string[]>([]);

  
  useEffect(() => {
    if (!jobId) return;

    const jobs: JobForm[] = JSON.parse(localStorage.getItem("jobs") || "[]");
    const foundJob = jobs.find((item) => String(item.id) === String(jobId));

    if (foundJob) {
      setJob(foundJob);
      setInitialJob(foundJob);

      const jobSkills = foundJob.skills || [];
      setSkills(jobSkills);
      setInitialSkills(jobSkills);
    }
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setJob((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();
    if (!value || skills.includes(value)) return;

    setSkills([...skills, value]);
    setSkillInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const resetForm = () => {
    setJob(initialJob);
    setSkills(initialSkills);
    setSkillInput("");
  };

  const updateJob = () => {
    if (!jobId) {
      alert("Error: Job ID not found.");
      return;
    }

    const jobs: JobForm[] = JSON.parse(localStorage.getItem("jobs") || "[]");
    
    
    const jobIndex = jobs.findIndex((item) => String(item.id) === String(jobId));

    if (jobIndex === -1) {
      alert("Job not found in database.");
      return;
    }

    
    jobs[jobIndex] = {
      ...jobs[jobIndex],
      ...job,
      id: jobs[jobIndex].id, 
      skills: skills,
    };

    localStorage.setItem("jobs", JSON.stringify(jobs));
    alert("Job updated successfully!");
    navigate("/recruiter/manage-jobs");
  };

  const deleteJob = () => {
    if (!jobId) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting?"
    );
    if (!confirmDelete) return;

    const jobs: JobForm[] = JSON.parse(localStorage.getItem("jobs") || "[]");
    const updatedJobs = jobs.filter((item) => String(item.id) !== String(jobId));

    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    navigate("/recruiter/manage-jobs");
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/recruiter/manage-jobs")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Edit Job</h1>
              <p className="text-sm text-muted-foreground">
                Update your existing job posting.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={resetForm}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              variant="destructive"
              className="flex-1 md:flex-none"
              onClick={deleteJob}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>

            <Button
              className="btn-premium flex-1 md:flex-none"
              onClick={updateJob}
            >
              <Save className="w-4 h-4 mr-2" />
              Update Job
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">Job Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <Input
                name="title"
                value={job.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <Input
                name="company"
                value={job.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={job.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Salary</label>
              <Input
                name="salary"
                value={job.salary}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Experience</label>
              <Input
                name="experience"
                value={job.experience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Employment Type</label>
              <Input
                name="employmentType"
                value={job.employmentType}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                name="category"
                value={job.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Application Deadline
              </label>
              <Input
                type="date"
                name="deadline"
                value={job.deadline}
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">Job Description</h2>
          <Textarea
            name="description"
            rows={10}
            value={job.description}
            onChange={handleChange}
          />
        </Card>

        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">Required Skills</h2>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Add new skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />

            <Button
              onClick={addSkill}
              className="w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="flex items-center gap-2 px-3 py-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Card>

        
        <Card className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Live Preview</h2>
            <Badge>{job.employmentType || "Employment Type"}</Badge>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold">
                {job.title || "Job Title"}
              </h3>
              <p className="text-muted-foreground mt-2">
                {job.company || "Company Name"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">{job.location || "Location"}</Badge>
              <Badge variant="secondary">{job.salary || "Salary"}</Badge>
              <Badge variant="secondary">{job.experience || "Experience"}</Badge>
              <Badge variant="secondary">{job.category || "Category"}</Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground whitespace-pre-line">
                {job.description || "Job description will appear here..."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No skills added</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}