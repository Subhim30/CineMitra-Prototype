import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-400">
          No movies available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
        />
      ))}
    </div>
  );
}