import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Loader2, Lock, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { registerUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    location.state?.from || "/movies";

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !username.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await registerUser(
        username.trim(),
        email.trim(),
        password
      );

      // Registration already returns a token,
      // so log the user in immediately.
      login(data);

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      const backendError =
        error.data?.username?.[0] ||
        error.data?.email?.[0] ||
        error.data?.password?.[0] ||
        error.data?.error;

      setError(
        backendError ||
          error.message ||
          "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <Card className="w-full max-w-md border-white/10 bg-slate-900 p-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
            <Film className="h-6 w-6" />
          </div>

          <h1 className="mt-5 text-2xl font-bold">
            Create Your Account
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Join CineMitra and start booking movies.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="username">
              Username
            </Label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                id="username"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Choose a username"
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email
            </Label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Password
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm Password
            </Label>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Confirm your password"
                className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-600"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-3">
              <p className="text-sm text-red-400">
                {error}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link
            to="/login"
            state={{ from }}
            className="font-medium text-red-400 hover:text-red-300"
          >
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
