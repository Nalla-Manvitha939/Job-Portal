import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ArrowLeft,
  Search,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";

interface Application {
  id: number;

  jobId: number;
  jobTitle: string;
  company: string;

  salary: string;
  location: string;

  applicantId: number;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;

  coverLetter: string;
  portfolioLink: string;
  additionalNotes: string;

  recruiterId: number;
  recruiterName: string;

  resumeName: string;

  status: string;
  nextStep: string;

  appliedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending:
    "bg-yellow-500/10 text-yellow-700 border-yellow-200",

  Shortlisted:
    "bg-green-500/10 text-green-700 border-green-200",

  Reviewed:
    "bg-blue-500/10 text-blue-700 border-blue-200",

  Rejected:
    "bg-red-500/10 text-red-700 border-red-200",
};

export default function MyApplications() {
  const [, navigate] = useLocation();

  const [applications, setApplications] = useState<Application[]>([]);

  const [searchQuery, setSearchQuery] = useState("");

  const [filterStatus, setFilterStatus] =
    useState("all");

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    if (!currentUser) {
      return;
    }

    const allApplications: Application[] =
      JSON.parse(
        localStorage.getItem("applications") || "[]"
      );

    const userApplications =
      allApplications.filter(
        (app) =>
          Number(app.applicantId) ===
          Number(currentUser.id)
      );

    setApplications(userApplications);

    console.log("Current User:", currentUser);
    console.log(
      "Applications:",
      allApplications
    );
    console.log(
      "User Applications:",
      userApplications
    );
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.jobTitle
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        app.company
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" ||
        app.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [
    applications,
    searchQuery,
    filterStatus,
  ]);

  const stats = {
    total: applications.length,

    shortlisted: applications.filter(
      (a) => a.status === "Shortlisted"
    ).length,

    pending: applications.filter(
      (a) => a.status === "Pending"
    ).length,

    rejected: applications.filter(
      (a) => a.status === "Rejected"
    ).length,
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
            <h1 className="text-2xl font-bold">
              My Applications
            </h1>

            <p className="text-sm text-muted-foreground">
              Track all your submitted job applications.
            </p>
          </div>

        </div>

      </div>

      

      <div className="container py-8">

        

        <div className="grid md:grid-cols-4 gap-6 mb-8">

          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground">
              Total Applications
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {stats.total}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground">
              Shortlisted
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {stats.shortlisted}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {stats.pending}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <p className="text-sm text-muted-foreground">
              Rejected
            </p>

            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {stats.rejected}
            </h2>
          </Card>

        </div>

        

        <Card className="glass-card p-6 mb-8">

          <div className="grid md:grid-cols-2 gap-4">

            <div className="relative">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

              <Input
                className="pl-10"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />

            </div>

            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
            >

              <SelectTrigger>

                <SelectValue placeholder="Filter Status" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Status
                </SelectItem>

                <SelectItem value="Pending">
                  Pending
                </SelectItem>

                <SelectItem value="Shortlisted">
                  Shortlisted
                </SelectItem>

                <SelectItem value="Reviewed">
                  Reviewed
                </SelectItem>

                <SelectItem value="Rejected">
                  Rejected
                </SelectItem>

              </SelectContent>

            </Select>

          </div>

        </Card>
                

        <div className="space-y-4">

          {filteredApplications.length === 0 ? (

            <Card className="glass-card p-12 text-center">

              <h2 className="text-xl font-semibold mb-2">
                No Applications Found
              </h2>

              <p className="text-muted-foreground">
                You haven't applied for any jobs yet.
              </p>

              <Button
                className="mt-6 btn-premium"
                onClick={() =>
                  navigate("/user/browse-jobs")
                }
              >
                Browse Jobs
              </Button>

            </Card>

          ) : (

            filteredApplications.map((app) => (

              <Card
                key={app.id}
                className="glass-card p-6 hover:shadow-xl transition-all"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                  <div className="flex-1">

                    <h2 className="text-xl font-bold">
                      {app.jobTitle}
                    </h2>

                    <p className="text-muted-foreground mt-1">
                      {app.company}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">

                      <Badge
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <DollarSign className="w-3 h-3" />
                        {app.salary}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-3 h-3" />
                        {app.location}
                      </Badge>

                      <Badge
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          app.appliedAt
                        ).toLocaleDateString()}
                      </Badge>

                    </div>

                    <div className="mt-6 rounded-lg bg-muted/40 p-4">

                      <p className="text-sm text-muted-foreground">

                        <strong>Next Step:</strong>{" "}
                        {app.nextStep}

                      </p>

                    </div>

                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-4">

                    <Badge
                      className={`${
                        STATUS_COLORS[app.status] ??
                        "bg-gray-200 text-gray-700"
                      } border`}
                    >
                      {app.status}
                    </Badge>

                    <div className="flex gap-3">

                      <Button
                        variant="outline"
                        onClick={() =>
                          navigate(
                            `/user/job/${app.jobId}`
                          )
                        }
                      >
                        View Job
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() =>
                          alert(
                            `Resume: ${app.resumeName}`
                          )
                        }
                      >
                        View Resume
                      </Button>

                    </div>

                  </div>

                </div>

              </Card>

            ))

          )}

        </div>

      </div>

    </div>

  );

}