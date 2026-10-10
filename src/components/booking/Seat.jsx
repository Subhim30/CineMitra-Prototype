import { Armchair } from "lucide-react";

const SEAT_TYPE_STYLES = {
  STANDARD: {
    available:
      "border-slate-600 bg-slate-800 text-slate-300 hover:border-blue-400 hover:bg-blue-500/10 hover:text-blue-300",
    selected:
      "border-blue-300 bg-blue-600 text-white shadow-lg shadow-blue-950/50",
  },
  PREMIUM: {
    available:
      "border-amber-600/70 bg-amber-950/30 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 hover:text-amber-200",
    selected:
      "border-amber-200 bg-amber-500 text-slate-950 shadow-lg shadow-amber-950/50",
  },
  VIP: {
    available:
      "border-purple-500/70 bg-purple-950/30 text-purple-300 hover:border-purple-300 hover:bg-purple-500/10 hover:text-purple-200",
    selected:
      "border-purple-200 bg-purple-600 text-white shadow-lg shadow-purple-950/50",
  },
};

const TYPE_LABELS = {
  STANDARD: "Standard",
  PREMIUM: "Premium",
  VIP: "VIP",
};

export default function Seat({ seat, selected, onSelect }) {
  const seatType = seat?.seat_type || "STANDARD";
  const status = seat?.status || "AVAILABLE";

  const unavailable = status !== "AVAILABLE";

  const styles =
    SEAT_TYPE_STYLES[seatType] || SEAT_TYPE_STYLES.STANDARD;

  const typeLabel = TYPE_LABELS[seatType] || "Standard";

  const price = Number(seat?.price || 0);

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => onSelect(seat)}
      title={`${seat.seat_label} • ${typeLabel} • NPR ${price} • ${status}`}
      aria-label={`${seat.seat_label}, ${typeLabel}, NPR ${price}, ${status}`}
      className={`group relative flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-t-xl rounded-b-md border transition-all duration-200 ${
        unavailable
          ? "cursor-not-allowed border-slate-700 bg-slate-800/70 text-slate-600 opacity-50"
          : selected
            ? styles.selected
            : styles.available
      }`}
    >
      <Armchair
        className={`h-5 w-5 transition-transform ${
          !unavailable && !selected
            ? "group-hover:-translate-y-0.5"
            : ""
        }`}
      />

      <span className="text-[9px] font-semibold leading-none">
        {seat.seat_label}
      </span>

      {!unavailable && (
        <span className="pointer-events-none absolute -top-9 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-xl ring-1 ring-white/10 group-hover:block">
          {typeLabel} · NPR {price}
        </span>
      )}
    </button>
  );
}