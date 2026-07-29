import { useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  IndianRupee,
  Clock,
  Plus,
  X,
  Save,
  Send,
  RotateCcw,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JobForm {
  title: string;
  company: string;
  location: string;
  salary: string;
  experience: string;
  employmentType: string;
  category: string;
  deadline: string;
  description: string;
}

const INITIAL_JOB: JobForm = {
  title: "",
  company: "TechNova Solutions",
  location: "",
  salary: "",
  experience: "",
  employmentType: "Full-Time",
  category: "",
  deadline: "",
  description: "",
};

export default function PostJob() {
  const [, navigate] = useLocation();

  const [job, setJob] = useState<JobForm>(INITIAL_JOB);

  const [skillInput, setSkillInput] = useState("");

  const [skills, setSkills] = useState<string[]>([
    "React",
    "JavaScript",
  ]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setJob((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const addSkill = () => {
    const value = skillInput.trim();

    if (!value) return;

    if (skills.includes(value)) return;

    setSkills([...skills, value]);

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((item) => item !== skill));
  };

  const handleReset = () => {
    setJob(INITIAL_JOB);
    setSkills([]);
    setSkillInput("");
  };

  const publishJob = () => {
    
    if (
      !job.title.trim() ||
      !job.company.trim() ||
      !job.location.trim() ||
      !job.salary.trim() ||
      !job.experience.trim() ||
      !job.category.trim() ||
      !job.deadline.trim() ||
      !job.description.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    
    const jobs = JSON.parse(
      localStorage.getItem("jobs") || "[]"
    );

    
    const newJob = {
      id: Date.now(),
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      employmentType: job.employmentType,
      category: job.category,
      deadline: job.deadline,
      description: job.description,
      skills: skills,
      recruiterId: currentUser.id,
      recruiterName: currentUser.fullName,
      recruiterEmail: currentUser.email,
      status: "Active",
      applicants: 0,
      createdAt: new Date().toISOString(),
    };

    
    jobs.push(newJob);

    localStorage.setItem("jobs", JSON.stringify(jobs));
    console.log("Jobs saved:", jobs);
    console.log("LocalStorage jobs:", localStorage.getItem("jobs"));

    alert("Job Published Successfully!");

    
    setJob(INITIAL_JOB);
    setSkills([]);
    setSkillInput("");

    
    navigate("/recruiter/manage-jobs");
  };

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
              <h1 className="text-2xl font-bold">
                Post New Job
              </h1>

              <p className="text-sm text-muted-foreground">
                Create a professional job listing for candidates.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">

        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            Job Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title
              </label>

              <Input
                name="title"
                placeholder="Senior React Developer"
                value={job.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company
              </label>

              <Input
                name="company"
                value={job.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>

              <Input
                name="location"
                placeholder="Hyderabad"
                value={job.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salary
              </label>

              <Input
                name="salary"
                placeholder="10 LPA"
                value={job.salary}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Experience
              </label>

              <Input
                name="experience"
                placeholder="2-4 Years"
                value={job.experience}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Employment Type
              </label>

              <Input
                name="employmentType"
                value={job.employmentType}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>

              <Input
                name="category"
                placeholder="Software Development"
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
          <h2 className="text-xl font-semibold mb-6">
            Job Description
          </h2>

          <Textarea
            name="description"
            rows={10}
            placeholder="Describe the responsibilities, requirements, qualifications and expectations for this position..."
            value={job.description}
            onChange={handleChange}
          />
        </Card>

        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            Required Skills
          </h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add a skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />

            <Button onClick={addSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No skills added yet.
              </p>
            )}

            {skills.map((skill) => (
              <Badge
                key={skill}
                className="px-3 py-2 text-sm flex items-center gap-2"
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
          <h2 className="text-xl font-semibold mb-6">
            Benefits & Perks
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-5">
              ✅ Health Insurance
            </div>

            <div className="rounded-xl border p-5">
              ✅ Remote Work
            </div>

            <div className="rounded-xl border p-5">
              ✅ Flexible Working Hours
            </div>

            <div className="rounded-xl border p-5">
              ✅ Annual Bonus
            </div>

            <div className="rounded-xl border p-5">
              ✅ Paid Leaves
            </div>

            <div className="rounded-xl border p-5">
              ✅ Learning Budget
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              Live Preview
            </h2>

            <Badge className="bg-green-500 text-white">
              Draft
            </Badge>
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-2xl font-bold">
                {job.title || "Job Title"}
              </h3>

              <p className="text-muted-foreground mt-1">
                {job.company || "Company Name"}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {job.location && (
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.location}
                </Badge>
              )}

              {job.salary && (
                <Badge variant="secondary">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  {job.salary}
                </Badge>
              )}

              {job.experience && (
                <Badge variant="secondary">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {job.experience}
                </Badge>
              )}

              {job.employmentType && (
                <Badge variant="secondary">
                  <Clock className="w-3 h-3 mr-1" />
                  {job.employmentType}
                </Badge>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">
                Description
              </h4>

              <p className="text-muted-foreground whitespace-pre-line">
                {job.description ||
                  "The job description will appear here as you type."}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">
                Required Skills
              </h4>

              <div className="flex flex-wrap gap-2">
                {skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No skills added.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                    >
                      {skill}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6">
            Publishing Tips
          </h2>

          <ul className="space-y-3 text-sm text-muted-foreground list-disc pl-5">
            <li>
              Write a clear and descriptive job title.
            </li>

            <li>
              Mention salary whenever possible to attract more applicants.
            </li>

            <li>
              Keep the description detailed and well structured.
            </li>

            <li>
              Include relevant technical and soft skills.
            </li>

            <li>
              Set a realistic application deadline.
            </li>
          </ul>
        </Card>

        
        <div className="flex flex-col md:flex-row justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleReset}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>

          <Button
            className="btn-premium"
            onClick={publishJob}
          >
            <Send className="w-4 h-4 mr-2" />
            Publish Job
          </Button>
        </div>

      </div>
    </div>
  );
}