import Seat from "./Seat";

export default function SeatGrid({
  seats = [],
  selectedSeats = [],
  onSeatSelect,
}) {
  const rows = seats.reduce((groups, seat) => {
    if (!seat?.seat_label) {
      console.warn("Invalid seat data:", seat);
      return groups;
    }

    const row = String(seat.seat_label).charAt(0);

    if (!groups[row]) {
      groups[row] = [];
    }

    groups[row].push(seat);

    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="mx-auto max-w-2xl">
        <div className="h-2 rounded-full bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-70" />

        <p className="mt-3 text-center text-xs uppercase tracking-[0.3em] text-slate-500">
          Screen
        </p>
      </div>

      {/* Seats */}
      <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/50 p-6">
        <div className="mx-auto w-fit min-w-max space-y-4">
          {Object.entries(rows).map(([row, rowSeats]) => (
            <div
              key={row}
              className="flex items-center gap-3"
            >
              <span className="w-6 text-center text-sm font-medium text-slate-500">
                {row}
              </span>

              <div className="flex gap-2">
                {rowSeats.map((seat) => (
                  <Seat
                    key={seat.id}
                    seat={seat}
                    selected={selectedSeats.some(
                      (selected) => selected.id === seat.id
                    )}
                    onSelect={onSeatSelect}
                  />
                ))}
              </div>

              <span className="w-6 text-center text-sm font-medium text-slate-500">
                {row}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
        <Legend
          className="bg-slate-800"
          label="Available"
        />

        <Legend
          className="bg-red-600"
          label="Selected"
        />

        <Legend
          className="bg-slate-800 opacity-40"
          label="Booked / Held"
        />
      </div>
    </div>
  );
}

function Legend({ className, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded-sm border border-white/10 ${className}`}
      />

      <span>{label}</span>
    </div>
  );
}
