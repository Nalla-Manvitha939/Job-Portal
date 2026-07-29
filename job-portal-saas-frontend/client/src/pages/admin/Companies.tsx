import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  Building,
  Globe,
  Users,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function CompaniesPage() {
  const [, navigate] = useLocation();

  const [companies, setCompanies] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadData = () => {
      const companyData = JSON.parse(
        localStorage.getItem("companyProfile") || "null"
      );

      const jobsData = JSON.parse(
        localStorage.getItem("jobs") || "[]"
      );

      if (companyData) {
        setCompanies([companyData]);
      } else {
        setCompanies([]);
      }

      setJobs(jobsData);
    };

    loadData();

    window.addEventListener("storage", loadData);

    return () => window.removeEventListener("storage", loadData);
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        (company.companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (company.industry || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (company.status || "Verified") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, search, statusFilter]);

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
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
              <h1 className="text-2xl font-bold">Manage Companies</h1>
              <p className="text-sm text-muted-foreground">
                Manage registered companies and recruiters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Building className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Companies</p>
            <h2 className="text-3xl font-bold">{companies.length}</h2>
          </Card>

          <Card className="glass-card p-6">
            <CheckCircle className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">Verified</p>
            <h2 className="text-3xl font-bold">
              {
                companies.filter(
                  (c) => (c.status || "Verified") === "Verified"
                ).length
              }
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <Users className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <h2 className="text-3xl font-bold">
              {companies.reduce(
                (sum, c) => sum + Number(c.companySize || c.employees || 0),
                0
              )}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <Globe className="w-8 h-8 text-orange-600 mb-3" />
            <p className="text-sm text-muted-foreground">Active Jobs</p>
            <h2 className="text-3xl font-bold">
              {jobs.filter((job) => job.status !== "Closed").length}
            </h2>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search companies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border rounded-lg px-4 py-2 bg-background"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Verified</option>
              <option>Pending</option>
            </select>
          </div>
        </Card>

        
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="text-left p-4 font-semibold">Company</th>
                  <th className="text-left p-4 font-semibold">Industry</th>
                  <th className="text-left p-4 font-semibold">Employees</th>
                  <th className="text-left p-4 font-semibold">Jobs</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCompanies.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No companies found.
                    </td>
                  </tr>
                ) : (
                  filteredCompanies.map((company, index) => {
                    const companyJobCount = jobs.filter(
                      (job) =>
                        job.company === (company.companyName || company.name)
                    ).length;

                    return (
                      <tr
                        key={company.id || index}
                        className="border-b hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building className="w-5 h-5 text-primary" />
                            </div>

                            <div>
                              <p className="font-semibold">
                                {company.companyName || company.name}
                              </p>

                              <p className="text-sm text-muted-foreground">
                                {company.website}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">{company.industry}</td>

                        <td className="p-4">
                          {company.companySize || company.employees || "-"}
                        </td>

                        <td className="p-4">{companyJobCount}</td>

                        <td className="p-4">
                          <Badge
                            className={
                              (company.status || "Verified") === "Verified"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }
                          >
                            {company.status || "Verified"}
                          </Badge>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              title="View Company"
                              onClick={() =>
                                console.log("View Company", company.id)
                              }
                            >
                              <Eye className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="outline"
                              title="Edit Company"
                              onClick={() =>
                                console.log("Edit Company", company.id)
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="outline"
                              title="Verify Company"
                              onClick={() =>
                                console.log("Verify Company", company.id)
                              }
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>

                            <Button
                              size="icon"
                              variant="destructive"
                              title="Delete Company"
                              onClick={() =>
                                console.log("Delete Company", company.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Company Management Summary
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredCompanies.length} of {companies.length}{" "}
                registered companies.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary">
                Verified:{" "}
                {
                  companies.filter(
                    (c) => (c.status || "Verified") === "Verified"
                  ).length
                }
              </Badge>

              <Badge variant="outline">
                Pending:{" "}
                {companies.filter((c) => c.status === "Pending").length}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}