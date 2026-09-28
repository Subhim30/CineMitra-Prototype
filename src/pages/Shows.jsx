import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  CalendarDays,
  Clapperboard,
  Loader2,
} from "lucide-react";

import { getShows } from "../services/movieApi";
import ShowGrid from "../components/shows/ShowGrid";

import { Button } from "@/components/ui/button";

export default function Shows() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const movieId = searchParams.get("movie");

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadShows() {
    try {
      setLoading(true);
      setError("");

      const data = await getShows();

      setShows(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShows();
  }, []);

  /*
   * If the user came from:
   *
   * /shows?movie=5
   *
   * only showtimes for movie 5 are displayed.
   */
  const filteredShows = useMemo(() => {
    if (!movieId) {
      return shows;
    }

    return shows.filter((show) => {
      const showMovieId =
        show.movie?.id ??
        show.movie_id ??
        show.movie;

      return String(showMovieId) === String(movieId);
    });
  }, [shows, movieId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex items-center gap-3 text-red-500">
            <Clapperboard className="h-5 w-5" />

            <span className="text-sm font-medium uppercase tracking-wider">
              CineMitra
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Choose Your Showtime
          </h1>

          <p className="mt-3 max-w-2xl text-slate-400">
            Select a movie, cinema, date, and available showtime
            for your next movie experience.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Filters/header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-red-500" />

              <h2 className="text-2xl font-bold">
                Available Shows
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {filteredShows.length} show
              {filteredShows.length !== 1 ? "s" : ""} available
            </p>
          </div>

          {movieId && (
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => {
                window.history.replaceState(
                  {},
                  "",
                  "/shows"
                );

                window.location.reload();
              }}
            >
              View All Shows
            </Button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-3 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
              Loading showtimes...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-6 text-center">
            <p className="text-red-400">
              Error loading shows: {error}
            </p>
          </div>
        )}

        {/* Shows */}
        {!loading && !error && (
          <ShowGrid shows={filteredShows} />
        )}
      </section>
    </div>
  );
}