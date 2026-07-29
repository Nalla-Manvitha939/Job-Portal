import { ReactNode } from "react";
import { Redirect } from "wouter";

type UserRole = "user" | "recruiter" | "admin";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const user = JSON.parse(localStorage.getItem("currentUser") || "null");

  if (!user) {
    return <Redirect to="/login" />;
  }

  
  if (!allowedRoles.includes(user.role)) {
    switch (user.role) {
      case "admin":
        return <Redirect to="/admin/dashboard" />;

      case "recruiter":
        return <Redirect to="/recruiter/dashboard" />;

      default:
        return <Redirect to="/user/dashboard" />;
    }
  }

  
  return <>{children}</>;
}