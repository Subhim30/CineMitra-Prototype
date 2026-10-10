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
import { Card, CardContent } from "@/components/ui/card";

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
        setError(err.message || "Failed to load movie.");
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-red-500" />
          <p className="text-sm text-slate-400">Loading movie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-950 px-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-white">
            Unable to load movie
          </h2>

          <p className="mt-2 text-sm text-slate-400">{error}</p>

          <Button
            onClick={() => navigate("/movies")}
            className="mt-6 bg-red-600 hover:bg-red-700"
          >
            Back to Movies
          </Button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl">🎬</div>

          <h2 className="text-xl font-semibold text-white">
            Movie not found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            The movie you are looking for does not exist.
          </p>

          <Button
            onClick={() => navigate("/movies")}
            className="mt-6 bg-red-600 hover:bg-red-700"
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

  const rating =
    movie.rating !== null && movie.rating !== undefined
      ? movie.rating
      : "N/A";

  const duration = movie.duration
    ? `${movie.duration} min`
    : "N/A";

  const releaseDate = movie.release_date || "N/A";

  const hasTrailer =
    movie.trailer_url ||
    movie.trailer ||
    movie.trailer_link;

  const trailerUrl =
    movie.trailer_url ||
    movie.trailer ||
    movie.trailer_link;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        {/* Background */}
        {posterUrl && (
          <div className="absolute inset-0">
            <img
              src={posterUrl}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover opacity-20 blur-3xl"
            />

            <div className="absolute inset-0 bg-slate-950/85" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
          </div>
        )}

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-14">
          {/* BACK */}
          <Button
            variant="ghost"
            onClick={() => navigate("/movies")}
            className="mb-8 -ml-3 text-slate-300 hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>

          <div className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-14">
            {/* POSTER */}
            <div className="mx-auto w-full max-w-[300px]">
              <div className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/40">
                {posterUrl ? (
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="aspect-[2/3] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex aspect-[2/3] items-center justify-center bg-slate-900">
                    <div className="text-center">
                      <div className="text-6xl opacity-30">🎬</div>

                      <p className="mt-3 text-sm text-slate-500">
                        No Poster Available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* MOVIE INFORMATION */}
            <div className="flex flex-col justify-center">
              {/* GENRE */}
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genre && (
                  <Badge className="border-0 bg-red-600 px-3 py-1 text-white hover:bg-red-600">
                    {movie.genre}
                  </Badge>
                )}

                <Badge
                  variant="outline"
                  className="border-white/10 bg-white/5 text-slate-300"
                >
                  Movie
                </Badge>
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {/* META */}
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                  <span className="font-semibold text-white">
                    {rating}
                  </span>

                  {rating !== "N/A" && (
                    <span className="text-slate-500">/ 10</span>
                  )}
                </span>

                <span className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  {duration}
                </span>

                <span className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-slate-400" />
                  {releaseDate}
                </span>
              </div>

              {/* DESCRIPTION */}
              {movie.description && (
                <p className="mt-8 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
                  {movie.description}
                </p>
              )}

              {/* ACTIONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="bg-red-600 px-6 shadow-lg shadow-red-600/20 hover:bg-red-700"
                >
                  <Link to={`/shows?movie=${movie.id}`}>
                    <Ticket className="mr-2 h-4 w-4" />
                    View Shows
                  </Link>
                </Button>

                {hasTrailer && trailerUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-white/10 bg-white/5 px-6 text-white hover:bg-white/10"
                  >
                    <a
                      href={trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Watch Trailer
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="lg"
                    disabled
                    className="border-white/10 bg-white/5 px-6 text-slate-500"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Trailer Unavailable
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOVIE INFORMATION */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wider text-red-500">
            Movie Details
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            About this movie
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* RELEASE DATE */}
          <Card className="border-white/10 bg-slate-900/80 shadow-none">
            <CardContent className="p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <CalendarDays className="h-5 w-5 text-red-500" />
              </div>

              <p className="text-sm text-slate-500">
                Release Date
              </p>

              <p className="mt-1 font-semibold text-white">
                {releaseDate}
              </p>
            </CardContent>
          </Card>

          {/* RUNTIME */}
          <Card className="border-white/10 bg-slate-900/80 shadow-none">
            <CardContent className="p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                <Clock className="h-5 w-5 text-red-500" />
              </div>

              <p className="text-sm text-slate-500">
                Runtime
              </p>

              <p className="mt-1 font-semibold text-white">
                {duration}
              </p>
            </CardContent>
          </Card>

          {/* RATING */}
          <Card className="border-white/10 bg-slate-900/80 shadow-none">
            <CardContent className="p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>

              <p className="text-sm text-slate-500">
                Rating
              </p>

              <p className="mt-1 font-semibold text-white">
                {rating !== "N/A" ? `${rating} / 10` : "Not Rated"}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
