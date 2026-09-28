import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { createBooking } from "../services/bookingApi";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();

  const { show, selectedSeats = [] } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState(null);

  if (!show || selectedSeats.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-6 text-white">
        <Card className="w-full max-w-md border-white/10 bg-slate-900 p-8 text-center">
          <Ticket className="mx-auto h-10 w-10 text-red-500" />

          <h1 className="mt-4 text-xl font-semibold">
            No Booking Selected
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Please select a show and seats before continuing.
          </p>

          <Button
            asChild
            className="mt-6 bg-red-600 hover:bg-red-700"
          >
            <Link to="/shows">
              Browse Shows
            </Link>
          </Button>
        </Card>
      </div>
    );
  }

  const total = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.price),
    0
  );

  async function handleConfirmBooking() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });

      return;
    }

    try {
      setLoading(true);
      setError("");

      const showSeatIds = selectedSeats.map(
        (seat) => seat.id
      );

      const data = await createBooking(
        show.id,
        showSeatIds,
        token
      );

      setBooking(data);
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        localStorage.removeItem("token");

        navigate("/login", {
          state: {
            from: location.pathname,
          },
        });

        return;
      }

      setError(
        error.data?.error ||
          error.message ||
          "Failed to create booking."
      );
    } finally {
      setLoading(false);
    }
  }

  /* Booking successfully created */
  if (booking) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-2xl">
          <Card className="border-white/10 bg-slate-900 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">
              Booking Confirmed
            </h1>

            <p className="mt-2 text-slate-400">
              Your seats have been successfully booked.
            </p>

            <div className="mt-8 rounded-xl border border-white/10 bg-slate-950/60 p-6 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-slate-500">
                  Booking Code
                </span>

                <span className="font-semibold text-red-400">
                  {booking.booking_code}
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <InfoRow
                  label="Movie"
                  value={booking.movie_title}
                />

                <InfoRow
                  label="Hall"
                  value={booking.hall_name}
                />

                <InfoRow
                  label="Date"
                  value={booking.show_date}
                />

                <InfoRow
                  label="Time"
                  value={booking.start_time}
                />

                <div>
                  <p className="text-xs text-slate-500">
                    Seats
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {booking.booking_seats?.map((seat) => (
                      <Badge
                        key={seat.id}
                        className="border-0 bg-red-600/10 text-red-400"
                      >
                        {seat.seat_label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-sm text-slate-400">
                    Total
                  </span>

                  <span className="text-xl font-bold">
                    NPR{" "}
                    {Number(
                      booking.total_amount
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <Link to="/shows">
                  Browse More Shows
                </Link>
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                onClick={() => navigate("/movies")}
              >
                Back to Movies
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <Button
            variant="ghost"
            asChild
            className="-ml-3 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Link to={`/shows/${show.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Seats
            </Link>
          </Button>

          <h1 className="mt-6 text-3xl font-bold">
            Confirm Your Booking
          </h1>

          <p className="mt-2 text-slate-400">
            Review your booking details before confirming.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Booking details */}
          <Card className="border-white/10 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              {show.movie_title}
            </h2>

            <div className="mt-6 space-y-5">
              <InfoRow
                icon={MapPin}
                label="Cinema"
                value={`${show.vendor_name} · ${show.branch_name}`}
              />

              <InfoRow
                icon={Ticket}
                label="Hall"
                value={show.hall_name}
              />

              <InfoRow
                icon={CalendarDays}
                label="Date"
                value={show.show_date}
              />

              <InfoRow
                icon={Clock}
                label="Showtime"
                value={show.start_time}
              />

              <div className="border-t border-white/10 pt-5">
                <p className="text-xs text-slate-500">
                  Selected Seats
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <Badge
                      key={seat.id}
                      className="border-0 bg-red-600/10 text-red-400"
                    >
                      {seat.seat_label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Payment summary */}
          <Card className="h-fit border-white/10 bg-slate-900 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Seats
                </span>

                <span>
                  {selectedSeats.length}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">
                  Price per seat
                </span>

                <span>
                  NPR{" "}
                  {Number(
                    show.ticket_price
                  ).toLocaleString()}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    Total
                  </span>

                  <span className="text-2xl font-bold">
                    NPR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/20 bg-red-950/20 p-4">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="button"
                disabled={loading}
                onClick={handleConfirmBooking}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>

              <p className="text-center text-xs leading-5 text-slate-500">
                Your selected seats will be reserved once
                the booking is confirmed.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="rounded-md bg-white/5 p-2">
          <Icon className="h-4 w-4 text-red-500" />
        </div>
      )}

      <div>
        <p className="text-xs text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-sm text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}