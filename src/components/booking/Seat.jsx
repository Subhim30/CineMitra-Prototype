import { Armchair } from "lucide-react";

export default function Seat({
  seat,
  selected,
  onSelect,
}) {
  const unavailable = seat.status !== "AVAILABLE";

  return (
    <button
      type="button"
      disabled={unavailable}
      onClick={() => onSelect(seat)}
      className={`group flex h-11 w-11 items-center justify-center rounded-t-lg border transition-all duration-200 ${
        unavailable
          ? "cursor-not-allowed border-slate-700 bg-slate-800 text-slate-600"
          : selected
            ? "border-red-400 bg-red-600 text-white shadow-lg shadow-red-950/40"
            : "border-slate-600 bg-slate-800 text-slate-400 hover:border-red-500 hover:bg-red-600/20 hover:text-red-400"
      }`}
      title={`${seat.seat_label} - ${seat.status}`}
    >
      <Armchair className="h-5 w-5" />
    </button>
  );
}
