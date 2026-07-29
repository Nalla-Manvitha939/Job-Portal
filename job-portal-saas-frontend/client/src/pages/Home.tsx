import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, MapPin, Briefcase, Users, TrendingUp, CheckCircle, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";

const FEATURED_JOBS = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp",
    salary: "$120k - $160k",
    experience: "5+ years",
    type: "Full-time",
    mode: "Remote",
    skills: ["React", "TypeScript", "Node.js"],
    logo: "TC"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    salary: "$100k - $140k",
    experience: "3+ years",
    type: "Full-time",
    mode: "Hybrid",
    skills: ["Product Strategy", "Analytics", "Leadership"],
    logo: "SX"
  },
  {
    id: 3,
    title: "UX/UI Designer",
    company: "DesignStudio",
    salary: "$80k - $120k",
    experience: "2+ years",
    type: "Full-time",
    mode: "On-site",
    skills: ["Figma", "UI Design", "Prototyping"],
    logo: "DS"
  },
];

const TOP_COMPANIES = [
  { id: 1, name: "TechCorp", industry: "Technology", rating: 4.8, positions: 12, logo: "TC" },
  { id: 2, name: "StartupXYZ", industry: "SaaS", rating: 4.6, positions: 8, logo: "SX" },
  { id: 3, name: "DesignStudio", industry: "Design", rating: 4.9, positions: 5, logo: "DS" },
  { id: 4, name: "FinanceHub", industry: "Finance", rating: 4.7, positions: 15, logo: "FH" },
];

const CATEGORIES = [
  { name: "Technology", count: 2543, icon: "💻" },
  { name: "Design", count: 1245, icon: "🎨" },
  { name: "Marketing", count: 892, icon: "📊" },
  { name: "Sales", count: 756, icon: "💼" },
  { name: "HR", count: 543, icon: "👥" },
  { name: "Finance", count: 634, icon: "💰" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const handleBrowseJobs = () => {
    if (isAuthenticated) {
      navigate("/user/browse-jobs");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">
              JP
            </div>
            <span className="font-bold text-lg">JobPortal</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/user/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="outline">Profile</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Find Your Dream <span className="gradient-bg bg-clip-text text-transparent">Job Today</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover thousands of job opportunities from top companies. Connect with employers and advance your career.
              </p>
            </div>

            
            <div className="flex gap-2 pt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Job title or keyword"
                  className="pl-10"
                />
              </div>
              <Button size="lg" className="btn-premium">
                Search
              </Button>
            </div>

            
            <div className="flex flex-wrap gap-2 pt-4">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["React Developer", "Product Manager", "UI Designer"].map((keyword) => (
                <Badge key={keyword} variant="secondary" className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
                  {keyword}
                </Badge>
              ))}
            </div>

            
            <div className="flex gap-4 pt-6">
              <Button size="lg" className="btn-premium" onClick={handleBrowseJobs}>
                Browse Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Post a Job
              </Button>
            </div>
          </div>

          
          <div className="glass-card p-8 h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">📊</div>
              <p className="text-sm text-muted-foreground">Premium Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Jobs</h2>
            <p className="text-muted-foreground">Handpicked opportunities from top companies</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURED_JOBS.map((job) => (
              <Card key={job.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent">
                    {job.logo}
                  </div>
                  <Badge variant="outline">{job.type}</Badge>
                </div>

                <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{job.company}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {job.experience}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {job.mode}
                  </div>
                  <div className="font-semibold text-accent">{job.salary}</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full" onClick={() => navigate(`/user/job/${job.id}`)}>
                  View Details
                </Button>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <Button variant="outline" size="lg" onClick={handleBrowseJobs}>
              View All Jobs <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Top Companies</h2>
            <p className="text-muted-foreground">Trusted by leading organizations worldwide</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {TOP_COMPANIES.map((company) => (
              <Card key={company.id} className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent mb-4">
                  {company.logo}
                </div>

                <h3 className="font-bold mb-2">{company.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{company.industry}</p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-semibold">{company.rating} ⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Open Positions</span>
                    <span className="font-semibold">{company.positions}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" size="sm">
                  View Jobs
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Browse by Category</h2>
            <p className="text-muted-foreground">Explore opportunities in your field</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <Card key={category.name} className="glass-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="text-3xl">{category.icon}</div>
                    <h3 className="font-bold group-hover:text-accent transition-colors">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} jobs</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      
      <section className="container py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: "Total Jobs", value: "50,000+", icon: Briefcase },
            { label: "Companies", value: "10,000+", icon: Users },
            { label: "Candidates", value: "500,000+", icon: Users },
            { label: "Placements", value: "100,000+", icon: TrendingUp },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} className="glass-card p-6 text-center">
                <Icon className="w-8 h-8 text-accent mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </section>

      
      <section className="container py-16">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to find your next opportunity</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: "Create Account", desc: "Sign up and build your profile", icon: "📝" },
              { step: 2, title: "Search & Apply", desc: "Browse jobs and apply instantly", icon: "🔍" },
              { step: 3, title: "Get Hired", desc: "Connect with employers and land your job", icon: "🎉" },
            ].map((item) => (
              <div key={item.step} className="text-center space-y-4">
                <div className="text-5xl">{item.icon}</div>
                <div className="space-y-2">
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent font-semibold text-sm">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="container py-16">
        <Card className="glass-card p-12 text-center space-y-6 bg-gradient-to-r from-accent/10 to-accent/5">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Find Your Dream Job?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect match on our platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="btn-premium" onClick={() => navigate("/register")}>
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={handleBrowseJobs}>
              Browse Jobs
            </Button>
          </div>
        </Card>
      </section>

      
      <footer className="border-t border-border mt-20 py-12 bg-card/50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">
                  JP
                </div>
                <span className="font-bold">JobPortal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium recruitment platform connecting talent with opportunity.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Browse Jobs</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Companies</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 JobPortal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
