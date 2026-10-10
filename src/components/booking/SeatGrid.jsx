import Seat from "./Seat";

const TYPE_INFO = {
  STANDARD: {
    label: "Standard",
    description: "Regular seating",
    className: "bg-slate-800 border-slate-600",
  },
  PREMIUM: {
    label: "Premium",
    description: "Preferred seating",
    className: "bg-amber-950/50 border-amber-600/70",
  },
  VIP: {
    label: "VIP",
    description: "Luxury seating",
    className: "bg-purple-950/50 border-purple-500/70",
  },
};

export default function SeatGrid({
  seats = [],
  selectedSeats = [],
  onSeatSelect,
}) {
  const validSeats = seats.filter(
    (seat) => seat?.seat_label
  );

  const rows = validSeats.reduce((groups, seat) => {
    const row = String(seat.seat_label).charAt(0);

    if (!groups[row]) {
      groups[row] = [];
    }

    groups[row].push(seat);

    return groups;
  }, {});

  const sortedRows = Object.entries(rows).sort(([rowA], [rowB]) =>
    rowA.localeCompare(rowB, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );

  const availableCount = validSeats.filter(
    (seat) => seat.status === "AVAILABLE"
  ).length;

  const bookedCount = validSeats.filter(
    (seat) => seat.status !== "AVAILABLE"
  ).length;

  const selectedCount = selectedSeats.length;

  const seatTypes = [
    ...new Set(
      validSeats.map((seat) => seat.seat_type || "STANDARD")
    ),
  ];

  if (validSeats.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-12 text-center">
        <p className="text-sm text-slate-400">
          No seats are available for this show.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cinema screen */}
      <div className="mx-auto w-full max-w-3xl">
        <div className="relative">
          <div className="mx-auto h-1.5 w-[85%] rounded-full bg-white shadow-[0_0_25px_rgba(255,255,255,0.25)]" />

          <div className="mx-auto mt-1 h-8 w-[70%] rounded-[50%] bg-white/10 blur-md" />

          <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.45em] text-slate-500">
            Screen
          </p>
        </div>
      </div>

      {/* Seat summary */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-xs text-slate-400">
          <span className="font-semibold text-white">
            {validSeats.length}
          </span>{" "}
          total seats
        </div>

        <div className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-2 text-xs text-emerald-400">
          <span className="font-semibold">
            {availableCount}
          </span>{" "}
          available
        </div>

        <div className="rounded-full border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">
          <span className="font-semibold">
            {selectedCount}
          </span>{" "}
          selected
        </div>

        <div className="rounded-full border border-white/10 bg-slate-900/70 px-4 py-2 text-xs text-slate-500">
          <span className="font-semibold">
            {bookedCount}
          </span>{" "}
          unavailable
        </div>
      </div>

      {/* Seat layout */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-6">
        <div className="mx-auto w-fit min-w-max space-y-5">
          {sortedRows.map(([row, rowSeats]) => {
            const sortedSeats = [...rowSeats].sort((a, b) => {
              const numberA =
                Number(String(a.seat_label).replace(/\D/g, "")) || 0;

              const numberB =
                Number(String(b.seat_label).replace(/\D/g, "")) || 0;

              return numberA - numberB;
            });

            return (
              <div
                key={row}
                className="flex items-center gap-3"
              >
                {/* Left row label */}
                <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-500">
                  {row}
                </span>

                {/* Seats */}
                <div className="flex items-center gap-2">
                  {sortedSeats.map((seat, index) => {
                    /*
                     * Creates a small aisle in the middle of
                     * larger rows without changing the actual
                     * seat data.
                     */
                    const previousSeat =
                      sortedSeats[index - 1];

                    const currentNumber =
                      Number(
                        String(seat.seat_label).replace(
                          /\D/g,
                          ""
                        )
                      ) || 0;

                    const previousNumber =
                      previousSeat
                        ? Number(
                            String(
                              previousSeat.seat_label
                            ).replace(/\D/g, "")
                          ) || 0
                        : currentNumber;

                    const hasGap =
                      currentNumber - previousNumber > 1;

                    return (
                      <div
                        key={seat.id}
                        className={hasGap ? "ml-5" : ""}
                      >
                        <Seat
                          seat={seat}
                          selected={selectedSeats.some(
                            (selected) =>
                              selected.id === seat.id
                          )}
                          onSelect={onSeatSelect}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Right row label */}
                <span className="w-6 shrink-0 text-center text-xs font-bold text-slate-500">
                  {row}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat type legend */}
      {seatTypes.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Seat Types
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            {seatTypes.map((type) => {
              const info =
                TYPE_INFO[type] || TYPE_INFO.STANDARD;

              return (
                <div
                  key={type}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`h-5 w-5 rounded-md border ${info.className}`}
                  />

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      {info.label}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {info.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status legend */}
      <div className="flex flex-wrap justify-center gap-5 text-xs text-slate-400">
        <Legend
          className="border-slate-600 bg-slate-800"
          label="Available"
        />

        <Legend
          className="border-blue-300 bg-blue-600"
          label="Selected"
        />

        <Legend
          className="border-slate-700 bg-slate-800 opacity-50"
          label="Booked / Held"
        />
      </div>

      {/* Selection message */}
      {selectedCount > 0 && (
        <div className="mx-auto max-w-xl rounded-xl border border-blue-500/20 bg-blue-500/5 px-5 py-3 text-center">
          <p className="text-sm text-blue-300">
            {selectedCount}{" "}
            {selectedCount === 1 ? "seat" : "seats"} selected
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Review your selection before continuing to
            booking.
          </p>
        </div>
      )}
    </div>
  );
}

function Legend({ className, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-4 w-4 rounded-md border ${className}`}
      />

      <span>{label}</span>
    </div>
  );
}