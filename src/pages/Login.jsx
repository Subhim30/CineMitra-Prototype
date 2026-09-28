import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Film, Loader2, Lock, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { loginUser } from "../services/authApi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from =
    location.state?.from || "/movies";

  async function handleSubmit(event) {
    event.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(
        username.trim(),
        password
      );

      login(data);

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      setError(
        error.data?.error ||
          error.message ||
          "Login failed."
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
            Welcome to CineMitra
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to continue booking your seats.
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
                placeholder="Enter your username"
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
                placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            state={{ from }}
            className="font-medium text-red-400 hover:text-red-300"
          >
            Create one
          </Link>
        </div>
      </Card>
    </div>
  );
}
