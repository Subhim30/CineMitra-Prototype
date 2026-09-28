import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BookingSummary({
  show,
  selectedSeats,
  onContinue,
}) {
  const price = Number(
    show?.price ?? show?.ticket_price ?? 0
  );

  const total = price * selectedSeats.length;

  const movieTitle =
    show?.movie?.title ||
    show?.movie_title ||
    "Movie";

  const cinemaName =
    show?.cinema?.name ||
    show?.cinema_name ||
    show?.theater ||
    "Cinema";

  const showDate =
    show?.date ||
    show?.show_date ||
    "Date unavailable";

  const showTime =
    show?.time ||
    show?.show_time ||
    "Time unavailable";

  return (
    <Card className="sticky top-24 border-white/10 bg-slate-900 p-6 text-white">
      <div className="flex items-center gap-2">
        <Ticket className="h-5 w-5 text-red-500" />

        <h2 className="text-xl font-semibold">
          Booking Summary
        </h2>
      </div>

      <div className="mt-6 space-y-5">
        {/* Movie */}
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Movie
          </p>

          <p className="mt-1 text-lg font-semibold">
            {movieTitle}
          </p>
        </div>

        {/* Cinema */}
        <div className="flex gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

          <div>
            <p className="text-xs text-slate-500">
              Cinema
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {cinemaName}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="flex gap-3">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

          <div>
            <p className="text-xs text-slate-500">
              Date
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {showDate}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

          <div>
            <p className="text-xs text-slate-500">
              Showtime
            </p>

            <p className="mt-1 text-sm text-slate-300">
              {showTime}
            </p>
          </div>
        </div>

        {/* Seats */}
        <div className="border-t border-white/10 pt-5">
          <p className="text-xs uppercase tracking-wider text-slate-500">
            Selected Seats
          </p>

          {selectedSeats.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat}
                  className="rounded-md bg-red-600/15 px-3 py-1.5 text-sm font-medium text-red-400"
                >
                  {seat}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">
              No seats selected
            </p>
          )}
        </div>

        {/* Price */}
        <div className="border-t border-white/10 pt-5">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>
              {selectedSeats.length} ticket
              {selectedSeats.length !== 1 ? "s" : ""}
            </span>

            <span>
              NPR {price.toLocaleString()}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-semibold">
              Total
            </span>

            <span className="text-2xl font-bold text-red-500">
              NPR {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Continue */}
        <Button
          className="w-full bg-red-600 hover:bg-red-700"
          size="lg"
          disabled={selectedSeats.length === 0}
          onClick={onContinue}
        >
          Continue to Booking
        </Button>
      </div>
    </Card>
  );
}