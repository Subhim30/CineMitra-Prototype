import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Play,
  Star,
  Ticket,
} from "lucide-react";

import { getMovie } from "../services/movieApi";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovie(id);
        setMovie(data);
      } catch (err) {
        setError(
          err.message || "Failed to load movie."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <p className="text-slate-400">
          Loading movie...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <p className="text-red-400">{error}</p>

          <Button
            onClick={() => navigate("/movies")}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">
            Movie not found
          </h2>

          <Button
            onClick={() => navigate("/movies")}
            className="mt-4 bg-red-600 hover:bg-red-700"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  const posterUrl = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : `${import.meta.env.VITE_API_URL}${movie.poster}`
    : null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background poster */}
        {posterUrl && (
          <div className="absolute inset-0">
            <img
              src={posterUrl}
              alt=""
              className="h-full w-full object-cover opacity-20 blur-2xl"
            />

            <div className="absolute inset-0 bg-slate-950/80" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          {/* BACK */}
          <Button
            variant="ghost"
            onClick={() => navigate("/movies")}
            className="mb-8 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>

          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:items-start">
            {/* POSTER */}
            <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="aspect-[2/3] h-full w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-slate-800">
                  <div className="text-center">
                    <div className="text-6xl text-slate-700">
                      🎬
                    </div>

                    <p className="mt-3 text-sm text-slate-500">
                      No Poster Available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* MOVIE INFO */}
            <div className="flex flex-col justify-center">
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genre && (
                  <Badge className="bg-red-600 text-white hover:bg-red-600">
                    {movie.genre}
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-white">
                    {movie.rating}
                  </span>
                  / 10
                </span>

                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {movie.duration} minutes
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  {movie.release_date}
                </span>
              </div>

              <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                {movie.description}
              </p>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="bg-red-600 px-6 hover:bg-red-700"
                >
                  <Link
                    to={`/shows?movie=${movie.id}`}
                  >
                    <Ticket className="mr-2 h-4 w-4" />
                    View Shows
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Watch Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOVIE INFORMATION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-white/10 bg-slate-900">
            <CardContent className="p-6">
              <CalendarDays className="mb-4 h-6 w-6 text-red-500" />

              <p className="text-sm text-slate-500">
                Release Date
              </p>

              <p className="mt-1 font-medium text-white">
                {movie.release_date}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900">
            <CardContent className="p-6">
              <Clock className="mb-4 h-6 w-6 text-red-500" />

              <p className="text-sm text-slate-500">
                Runtime
              </p>

              <p className="mt-1 font-medium text-white">
                {movie.duration} minutes
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-slate-900">
            <CardContent className="p-6">
              <Star className="mb-4 h-6 w-6 text-yellow-400" />

              <p className="text-sm text-slate-500">
                Rating
              </p>

              <p className="mt-1 font-medium text-white">
                {movie.rating} / 10
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}