import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    
    if (
      email.trim().toLowerCase() === "recruiter@jobportal.com" &&
      password === "recruiter@123"
    ) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: 999,
          name: "Recruiter",
          email: "recruiter@jobportal.com",
          role: "recruiter",
        })
      );

      navigate("/recruiter/dashboard");
      return;
    }

    
    if (
      email.trim().toLowerCase() === "admin@jobportal.com" &&
      password === "admin@123"
    ) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: 1000,
          name: "Admin",
          email: "admin@jobportal.com",
          role: "admin",
        })
      );

      navigate("/admin/dashboard");
      return;
    }

    
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Invalid email or password.");
        return;
      }

      
      const user = data.user || data;
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      alert("Login Successful!");

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "recruiter":
          navigate("/recruiter/dashboard");
          break;

        default:
          navigate("/user/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during login. Please check backend.");
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      const response = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.detail || "Google login failed.");
        return;
      }

      const user = data.user;

      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("token", data.access_token);

      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;

        case "recruiter":
          navigate("/recruiter/dashboard");
          break;

        default:
          navigate("/user/dashboard");
      }
    } catch (error) {
      console.error(error);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <div className="border-b border-border">
        <div className="container py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md px-4">
          <Card className="glass-card p-8 space-y-6">
            <div className="space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-accent-foreground font-bold">
                  JP
                </div>
              </div>
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-accent hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full btn-premium">
                Sign In
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    handleGoogleLogin(credentialResponse.credential);
                  }
                }}
                onError={() => {
                  alert("Google Login Failed");
                }}
              />
              <Button variant="outline" className="w-full">
                GitHub
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-accent hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
          </Card>

          <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20 text-sm text-muted-foreground">
            <p>
              <strong>Demo Credentials:</strong> Use admin, recruiter, or registered user emails to test.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}