import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";

export default function MovieCard({ movie }) {
  const posterUrl = movie.poster
    ? movie.poster.startsWith("http")
      ? movie.poster
      : `${import.meta.env.VITE_API_URL}${movie.poster}`
    : null;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-900 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:shadow-xl hover:shadow-red-950/20"
    >
      {/* POSTER */}
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-slate-700">
                🎬
              </div>
              <p className="mt-2 text-xs text-slate-500">
                No Poster
              </p>
            </div>
          </div>
        )}

        {/* GENRE */}
        {movie.genre && (
          <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {movie.genre}
          </div>
        )}

        {/* RATING */}
        {movie.rating !== undefined &&
          movie.rating !== null && (
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-medium text-yellow-400 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              {movie.rating}
            </div>
          )}
      </div>

      {/* INFO */}
      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-red-400">
          {movie.title}
        </h3>

        {movie.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">
            {movie.description}
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-500">
          {movie.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {movie.duration} min
            </span>
          )}

          {movie.release_date && (
            <span>
              {new Date(
                movie.release_date
              ).getFullYear()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
