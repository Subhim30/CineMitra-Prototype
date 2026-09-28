import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Film, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import MovieGrid from "../components/movies/MovieGrid";
import { getMovies } from "../services/movieApi";

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError("");

        const data = await getMovies();

        const movieList = Array.isArray(data)
          ? data
          : data.results || [];

        setMovies(movieList);
      } catch (error) {
        console.error(error);
        setError(
          error.message || "Failed to load movies."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return movies;
    }

    return movies.filter((movie) => {
      const title = movie.title?.toLowerCase() || "";
      const genre = movie.genre?.toLowerCase() || "";
      const description =
        movie.description?.toLowerCase() || "";

      return (
        title.includes(query) ||
        genre.includes(query) ||
        description.includes(query)
      );
    });
  }, [movies, searchQuery]);

  function handleSearch(event) {
    event.preventDefault();

    const query = searchInput.trim();

    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  }

  function clearSearch() {
    setSearchInput("");
    setSearchParams({});
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white">
      {/* Hero */}
      <section className="border-b border-white/10 bg-gradient-to-b from-red-950/20 via-slate-950 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.25em] text-red-500">
              <Film className="h-4 w-4" />
              CineMitra
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Your Next
              <span className="block text-red-500">
                Movie Experience
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Explore movies, discover showtimes, choose your
              seats, and book your cinema experience with
              CineMitra.
            </p>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-8 flex max-w-2xl gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                value={searchInput}
                onChange={(event) =>
                  setSearchInput(event.target.value)
                }
                placeholder="Search by movie title, genre..."
                className="h-11 border-white/10 bg-white/5 pl-10 text-white placeholder:text-slate-500 focus-visible:ring-red-500"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="h-11 bg-red-600 px-5 hover:bg-red-700"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Movies */}
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
              {searchQuery ? "Search Results" : "Now Showing"}
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Movies"}
            </h2>
          </div>

          {!loading && !error && (
            <p className="text-sm text-slate-500">
              {filteredMovies.length}{" "}
              {filteredMovies.length === 1
                ? "movie"
                : "movies"}
            </p>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-12 text-center">
            <p className="text-slate-400">
              Loading movies...
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-8 text-center">
            <p className="text-red-400">{error}</p>

            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && filteredMovies.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-slate-600" />

            <h3 className="mt-4 text-lg font-semibold">
              No movies found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Try searching with a different movie title or
              genre.
            </p>

            <Button
              variant="outline"
              onClick={clearSearch}
              className="mt-5 border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Clear Search
            </Button>
          </div>
        )}

        {!loading &&
          !error &&
          filteredMovies.length > 0 && (
            <MovieGrid movies={filteredMovies} />
          )}
      </section>
    </div>
  );
}
