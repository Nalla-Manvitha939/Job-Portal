import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";


import UserDashboard from "./pages/user/Dashboard";
import BrowseJobs from "./pages/user/BrowseJobs";
import JobDetails from "./pages/user/JobDetails";
import ApplyJob from "./pages/user/ApplyJob";
import MyApplications from "./pages/user/MyApplications";
import UserProfile from "./pages/user/Profile";


import RecruiterDashboard from "./pages/recruiter/Dashboard";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import PostJob from "./pages/recruiter/PostJob";
import ManageJobs from "./pages/recruiter/ManageJobs";
import EditJob from "./pages/recruiter/EditJob";
import Applicants from "./pages/recruiter/Applicants";
import RecruiterJobDetails from "./pages/recruiter/JobDetails"; 


import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminCompanies from "./pages/admin/Companies";
import AdminJobs from "./pages/admin/Jobs";
import AdminApplicants from "./pages/admin/Applicants";
import AdminReports from "./pages/admin/Reports";
import AdminAnalytics from "./pages/admin/Analytics";

function Router() {
  return (
    <Switch>
      
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      

      <Route path="/user/dashboard">
        <ProtectedRoute allowedRoles={["user"]}>
          <UserDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/user/browse-jobs">
        <ProtectedRoute allowedRoles={["user"]}>
          <BrowseJobs />
        </ProtectedRoute>
      </Route>

      <Route path="/user/job/:id">
        <ProtectedRoute allowedRoles={["user"]}>
          <JobDetails />
        </ProtectedRoute>
      </Route>

      <Route path="/user/apply/:id">
        <ProtectedRoute allowedRoles={["user"]}>
          <ApplyJob />
        </ProtectedRoute>
      </Route>

      <Route path="/user/applications">
        <ProtectedRoute allowedRoles={["user"]}>
          <MyApplications />
        </ProtectedRoute>
      </Route>

      <Route path="/user/profile">
        <ProtectedRoute allowedRoles={["user"]}>
          <UserProfile />
        </ProtectedRoute>
      </Route>

      

      <Route path="/recruiter/dashboard">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <RecruiterDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/company-profile">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <CompanyProfile />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/post-job">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <PostJob />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/manage-jobs">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <ManageJobs />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/job/:id">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <RecruiterJobDetails />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/edit-job/:id">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <EditJob />
        </ProtectedRoute>
      </Route>

      <Route path="/recruiter/applicants">
        <ProtectedRoute allowedRoles={["recruiter"]}>
          <Applicants />
        </ProtectedRoute>
      </Route>

      

      <Route path="/admin/dashboard">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/users">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminUsers />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/companies">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminCompanies />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/jobs">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminJobs />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/applicants">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminApplicants />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/reports">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminReports />
        </ProtectedRoute>
      </Route>

      <Route path="/admin/analytics">
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminAnalytics />
        </ProtectedRoute>
      </Route>

      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" switchable>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;