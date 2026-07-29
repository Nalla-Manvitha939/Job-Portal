import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, MapPin, Briefcase, DollarSign, Bookmark, BookmarkCheck, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
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

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const WORK_MODES = ["Remote", "On-site", "Hybrid"];

export default function BrowseJobs() {
  const [, navigate] = useLocation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "",
    mode: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const allJobs = JSON.parse(localStorage.getItem("jobs") || "[]");

    const activeJobs = allJobs.filter(
      (job: Job) => job.status === "Active"
    );

    setJobs(activeJobs);

    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    setCurrentUser(user);

    const storedSavedJobs = JSON.parse(
      localStorage.getItem("savedJobs") || "[]"
    );

    setSavedJobs(storedSavedJobs);
  }, []);

  const filteredJobs = jobs.filter((job) => {
    if (
      searchQuery &&
      !job.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      filters.type &&
      job.employmentType !== filters.type
    ) {
      return false;
    }

    if (
      filters.mode &&
      job.location.toLowerCase() !== filters.mode.toLowerCase()
    ) {
      return false;
    }

    return true;
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSaveJob = (job: Job) => {
    if (!currentUser) return;

    const exists = savedJobs.find(
      (item: any) =>
        item.jobId === job.id &&
        item.userId === currentUser.id
    );

    let updatedSavedJobs;

    if (exists) {
      updatedSavedJobs = savedJobs.filter(
        (item: any) =>
          !(
            item.jobId === job.id &&
            item.userId === currentUser.id
          )
      );
    } else {
      updatedSavedJobs = [
        ...savedJobs,
        {
          id: Date.now(),
          jobId: job.id,
          userId: currentUser.id,
          savedAt: new Date().toISOString(),
        },
      ];
    }

    localStorage.setItem(
      "savedJobs",
      JSON.stringify(updatedSavedJobs)
    );

    setSavedJobs(updatedSavedJobs);
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div>
            <h1 className="text-2xl font-bold">Browse Jobs</h1>
            <p className="text-sm text-muted-foreground">Showing {filteredJobs.length} opportunities</p>
          </div>
        </div>
      </div>

      
      <div className="container py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <Card className="glass-card p-6 space-y-6 sticky top-24">
              <div>
                <h3 className="font-bold mb-4">Filters</h3>
              </div>

              
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Job title..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              
              <div className="space-y-3">
                <Label>Job Type</Label>
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.type === type}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({ ...prev, type: checked ? type : "" }));
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>

             
              <div className="space-y-3">
                <Label>Work Mode</Label>
                {WORK_MODES.map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.mode === mode}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({ ...prev, mode: checked ? mode : "" }));
                        setCurrentPage(1);
                      }}
                    />
                    <span className="text-sm">{mode}</span>
                  </label>
                ))}
              </div>

              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFilters({ type: "", mode: "" });
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            </Card>
          </div>

          
          <div className="lg:col-span-3 space-y-6">
           
            <div className="space-y-4">
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job) => (
                  <Card key={job.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                          {job.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg group-hover:text-accent transition-colors cursor-pointer">
                            {job.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">{job.company}</p>
                        </div>
                      </div>
                      
                      
                      <button
                        onClick={() => toggleSaveJob(job)}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        {savedJobs.some(
                          (item: any) =>
                            item.jobId === job.id &&
                            item.userId === currentUser?.id
                        ) ? (
                          <BookmarkCheck className="w-5 h-5 text-accent" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="w-4 h-4" />
                        {job.experience}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary">{job.employmentType}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1" onClick={() => navigate(`/user/job/${job.id}`)}>
                        View Details
                      </Button>
                      <Button variant="outline" className="flex-1" onClick={() => navigate(`/user/apply/${job.id}`)}>
                        Apply Now
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="glass-card p-12 text-center">
                  <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                </Card>
              )}
            </div>

            
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}