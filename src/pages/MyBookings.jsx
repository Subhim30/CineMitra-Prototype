import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Film,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { getMyBookings } from "../services/bookingApi";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const navigate = useNavigate();
  const { token, isAuthenticated, loading: authLoading } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !token) {
      navigate("/login", {
        state: {
          from: "/my-bookings",
        },
        replace: true,
      });

      return;
    }

    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const data = await getMyBookings(token);

        setBookings(data);
      } catch (error) {
        console.error(error);

        if (error.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            state: {
              from: "/my-bookings",
            },
            replace: true,
          });

          return;
        }

        setError(
          error.data?.error ||
            error.message ||
            "Failed to load your bookings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, [authLoading, isAuthenticated, token, navigate]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          Loading your bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <Button
            variant="ghost"
            className="mb-5 px-0 text-slate-400 hover:bg-transparent hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/10">
                  <Ticket className="h-5 w-5 text-red-500" />
                </div>

                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
                    CineMitra
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight">
                    My Bookings
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm text-slate-400">
                View your movie tickets, show details, selected seats,
                and booking status.
              </p>
            </div>

            <Button
              asChild
              className="bg-red-600 hover:bg-red-700"
            >
              <Link to="/shows">
                <Film className="mr-2 h-4 w-4" />
                Browse Shows
              </Link>
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-500/20 bg-red-950/20 p-5">
            <p className="text-sm text-red-400">{error}</p>
          </Card>
        )}

        {/* Empty state */}
        {!error && bookings.length === 0 && (
          <Card className="border-white/10 bg-slate-900/60 p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Ticket className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              No bookings yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
              You haven't booked any movie tickets yet. Find a show
              and reserve your seats to see your tickets here.
            </p>

            <Button
              asChild
              className="mt-6 bg-red-600 hover:bg-red-700"
            >
              <Link to="/shows">Explore Shows</Link>
            </Button>
          </Card>
        )}

        {/* Booking list */}
        {bookings.length > 0 && (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookingCard({ booking }) {
  const status = booking.status?.toUpperCase();
  const paymentStatus = booking.payment_status?.toUpperCase();

  return (
    <Card className="overflow-hidden border-white/10 bg-slate-900/70">
      <div className="border-b border-white/10 bg-slate-950/50 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">
              Booking Code
            </p>

            <p className="mt-1 font-mono text-sm font-semibold text-red-400">
              {booking.booking_code}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge status={status} />

            <Badge
              variant="outline"
              className={
                paymentStatus === "PAID"
                  ? "border-green-500/30 text-green-400"
                  : "border-yellow-500/30 text-yellow-400"
              }
            >
              Payment: {booking.payment_status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          {/* Movie and show information */}
          <div>
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-600/10">
                <Film className="h-7 w-7 text-red-500" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  {booking.movie_title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  CineMitra Movie Ticket
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoItem
                icon={CalendarDays}
                label="Date"
                value={booking.show_date}
              />

              <InfoItem
                icon={Clock}
                label="Show Time"
                value={booking.start_time}
              />

              <InfoItem
                icon={MapPin}
                label="Hall"
                value={booking.hall_name}
              />

              <InfoItem
                icon={Ticket}
                label="Seats"
                value={
                  booking.booking_seats
                    ?.map((seat) => seat.seat_label)
                    .join(", ") || "N/A"
                }
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex min-w-[180px] flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Total Amount
              </p>

              <p className="mt-2 text-2xl font-bold">
                NPR{" "}
                {Number(booking.total_amount).toLocaleString()}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Booking recorded
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-white/5 p-2">
        <Icon className="h-4 w-4 text-red-500" />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>

        <p className="mt-1 break-words text-sm text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === "CONFIRMED") {
    return (
      <Badge className="border-0 bg-green-500/10 text-green-400">
        Confirmed
      </Badge>
    );
  }

  if (status === "CANCELLED") {
    return (
      <Badge className="border-0 bg-red-500/10 text-red-400">
        Cancelled
      </Badge>
    );
  }

  return (
    <Badge className="border-0 bg-yellow-500/10 text-yellow-400">
      Pending
    </Badge>
  );
}
