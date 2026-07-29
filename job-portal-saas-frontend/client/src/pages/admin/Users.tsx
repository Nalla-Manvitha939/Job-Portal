import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  Search,
  Users,
  UserCheck,
  UserX,
  Shield,
  Eye,
  Pencil,
  Trash2,
  Ban,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface User {
  id: number | string;
  name: string;
  email: string;
  role: "Admin" | "Recruiter" | "Job Seeker";
  joined: string;
  status: "Active" | "Inactive";
}

export default function UsersPage() {
  const [, navigate] = useLocation();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [users, setUsers] = useState<User[]>([]);

  
  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    const formattedUsers: User[] = storedUsers.map((user: any) => ({
      id: user.id,
      name:
        user.fullName ||
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username ||
        "Unnamed User",
      email: user.email || "No email provided",
      role:
        user.role === "admin" || user.role === "Admin"
          ? "Admin"
          : user.role === "recruiter" || user.role === "Recruiter"
          ? "Recruiter"
          : "Job Seeker",
      joined: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString()
        : "Recently",
      status: user.status || "Active",
    }));

    setUsers(formattedUsers);
  };

  
  useEffect(() => {
    loadUsers();

    const handleStorage = () => loadUsers();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("usersUpdated", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("usersUpdated", handleStorage);
    };
  }, []);

  
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "All" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter, users]);

  
  const handleDeleteUser = (userId: number | string) => {
    if (!confirm("Delete this user?")) return;

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.filter((u: any) => u.id !== userId);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadUsers();
    window.dispatchEvent(new Event("usersUpdated"));
  };

  
  const handleToggleBlock = (userId: number | string) => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.map((u: any) => {
      if (u.id === userId) {
        const currentStatus = u.status || "Active";
        return {
          ...u,
          status: currentStatus === "Active" ? "Inactive" : "Active",
        };
      }
      return u;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    loadUsers();
    window.dispatchEvent(new Event("usersUpdated"));
  };

  return (
    <div className="min-h-screen bg-background">
      {}
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
              <h1 className="text-2xl font-bold">Manage Users</h1>
              <p className="text-sm text-muted-foreground">
                View and manage all platform users.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <p className="text-sm text-muted-foreground">Total Users</p>
            <h2 className="text-3xl font-bold">{users.length}</h2>
          </Card>

          <Card className="glass-card p-6">
            <Shield className="w-8 h-8 text-purple-600 mb-3" />
            <p className="text-sm text-muted-foreground">Admins</p>
            <h2 className="text-3xl font-bold">
              {users.filter((u) => u.role === "Admin").length}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <UserCheck className="w-8 h-8 text-green-600 mb-3" />
            <p className="text-sm text-muted-foreground">Active Users</p>
            <h2 className="text-3xl font-bold">
              {users.filter((u) => u.status === "Active").length}
            </h2>
          </Card>

          <Card className="glass-card p-6">
            <UserX className="w-8 h-8 text-red-600 mb-3" />
            <p className="text-sm text-muted-foreground">Inactive Users</p>
            <h2 className="text-3xl font-bold">
              {users.filter((u) => u.status === "Inactive").length}
            </h2>
          </Card>
        </div>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border rounded-lg px-4 py-2 bg-background"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Recruiter">Recruiter</option>
              <option value="Job Seeker">Job Seeker</option>
            </select>
          </div>
        </Card>

        
        <Card className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="text-left p-4 font-semibold">User</th>
                  <th className="text-left p-4 font-semibold">Role</th>
                  <th className="text-left p-4 font-semibold">Joined</th>
                  <th className="text-left p-4 font-semibold">Status</th>
                  <th className="text-right p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <Badge variant="secondary">{user.role}</Badge>
                      </td>

                      <td className="p-4">{user.joined}</td>

                      <td className="p-4">
                        <Badge
                          className={
                            user.status === "Active"
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }
                        >
                          {user.status}
                        </Badge>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            title="View User"
                            onClick={() => console.log("View User", user.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            title="Edit User"
                            onClick={() => console.log("Edit User", user.id)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="outline"
                            title={user.status === "Active" ? "Block User" : "Unblock User"}
                            onClick={() => handleToggleBlock(user.id)}
                          >
                            <Ban className="w-4 h-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="destructive"
                            title="Delete User"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                User Management Summary
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {filteredUsers.length} of {users.length} registered users.
              </p>
            </div>

            <div className="flex gap-3">
              <Badge variant="secondary">
                Active: {users.filter((u) => u.status === "Active").length}
              </Badge>
              <Badge variant="outline">
                Recruiters: {users.filter((u) => u.role === "Recruiter").length}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}