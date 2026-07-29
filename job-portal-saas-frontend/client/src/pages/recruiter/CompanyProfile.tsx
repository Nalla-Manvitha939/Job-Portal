import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Upload,
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Save,
  RotateCcw,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CompanyData {
  companyName: string;
  industry: string;
  companySize: string;
  founded: string;
  website: string;
  email: string;
  phone: string;
  location: string;
  description: string;
  logo: string;
}

const DEFAULT_COMPANY: CompanyData = {
  companyName: "TechNova Solutions",
  industry: "Information Technology",
  companySize: "201-500 Employees",
  founded: "2018",
  website: "https://technova.com",
  email: "careers@technova.com",
  phone: "+91 9876543210",
  location: "Hyderabad, Telangana",
  description:
    "TechNova Solutions is a fast-growing SaaS company focused on AI-powered recruitment software and enterprise cloud solutions.",
  logo:
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=500",
};

export default function CompanyProfile() {
  const [, navigate] = useLocation();

  const [company, setCompany] = useState<CompanyData>(DEFAULT_COMPANY);

  
  useEffect(() => {
    const savedCompany = localStorage.getItem("companyProfile");
    if (savedCompany) {
      setCompany(JSON.parse(savedCompany));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCompany((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany((prev) => ({
        ...prev,
        logo: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("companyProfile", JSON.stringify(company));
    window.dispatchEvent(new Event("storage"));
    alert("Company profile saved successfully!");
  };

  const handleReset = () => {
    setCompany(DEFAULT_COMPANY);
    localStorage.removeItem("companyProfile");
  };

  return (
    <div className="min-h-screen bg-background">
      
      <div className="border-b border-border sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/recruiter/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div>
              <h1 className="text-2xl font-bold">Company Profile</h1>
              <p className="text-sm text-muted-foreground">
                Manage your company information and branding.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto justify-start md:justify-end">
            <Button
              variant="outline"
              className="flex-1 md:flex-none"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>

            <Button
              className="btn-premium flex-1 md:flex-none"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <Card className="glass-card p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="flex flex-col items-center">
              <img
                src={company.logo}
                alt="Company Logo"
                className="w-44 h-44 rounded-3xl object-cover border shadow-xl"
              />

              <label className="w-full">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleLogoUpload}
                />
                <Button variant="outline" className="mt-5 w-full" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </span>
                </Button>
              </label>

              <p className="text-xs text-muted-foreground text-center mt-3">
                PNG / JPG / SVG
                <br />
                Maximum size 5MB
              </p>
            </div>

            
            <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company Name
                </label>
                <Input
                  name="companyName"
                  value={company.companyName}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Industry
                </label>
                <Input
                  name="industry"
                  value={company.industry}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Company Size
                </label>
                <Input
                  name="companySize"
                  value={company.companySize}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Founded
                </label>
                <Input
                  name="founded"
                  value={company.founded}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Website
                </label>
                <Input
                  name="website"
                  value={company.website}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email Address
                </label>
                <Input
                  name="email"
                  value={company.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Phone Number
                </label>
                <Input
                  name="phone"
                  value={company.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Location
                </label>
                <Input
                  name="location"
                  value={company.location}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-5">Company Description</h2>
          <Textarea
            name="description"
            value={company.description}
            onChange={handleChange}
            rows={8}
          />
        </Card>

        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Building2 className="w-10 h-10 text-blue-600 mb-4" />
            <p className="text-sm text-muted-foreground">Industry</p>
            <h3 className="font-bold mt-2">{company.industry}</h3>
          </Card>

          <Card className="glass-card p-6">
            <Users className="w-10 h-10 text-purple-600 mb-4" />
            <p className="text-sm text-muted-foreground">Company Size</p>
            <h3 className="font-bold mt-2">{company.companySize}</h3>
          </Card>

          <Card className="glass-card p-6">
            <Calendar className="w-10 h-10 text-green-600 mb-4" />
            <p className="text-sm text-muted-foreground">Founded</p>
            <h3 className="font-bold mt-2">{company.founded}</h3>
          </Card>

          <Card className="glass-card p-6">
            <MapPin className="w-10 h-10 text-orange-600 mb-4" />
            <p className="text-sm text-muted-foreground">Headquarters</p>
            <h3 className="font-bold mt-2">{company.location}</h3>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <h2 className="text-lg font-semibold mb-5">Contact Information</h2>
          <div className="grid md:grid-cols-3 gap-5">
            <div className="rounded-xl border p-5 flex items-start gap-4">
              <Globe className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium break-all">{company.website}</p>
              </div>
            </div>

            <div className="rounded-xl border p-5 flex items-start gap-4">
              <Mail className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{company.email}</p>
              </div>
            </div>

            <div className="rounded-xl border p-5 flex items-start gap-4">
              <Phone className="w-6 h-6 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{company.phone}</p>
              </div>
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-lg font-semibold">Company Status</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Your recruiter profile is active and visible to job seekers.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="bg-green-500 hover:bg-green-500 text-white">
                Verified Company
              </Badge>
              <Badge variant="secondary">Hiring</Badge>
              <Badge variant="outline">Profile Complete</Badge>
            </div>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Profile Completion</h2>
            <span className="text-sm font-semibold text-primary">100%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            Your company profile is fully completed. Candidates can now discover
            your organization with complete information.
          </p>
        </Card>
      </div>
    </div>
  );
}