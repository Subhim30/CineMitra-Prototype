import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { getShow, getShowSeats } from "../services/movieApi";
import SeatGrid from "../components/booking/SeatGrid";

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [showSeats, setShowSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [showData, seatData] = await Promise.all([
          getShow(id),
          getShowSeats(id),
        ]);

        setShow(showData);

        const realSeats = Array.isArray(seatData)
          ? seatData
          : seatData.results || [];

        setShowSeats(realSeats);

        console.log("SHOW:", showData);
        console.log("REAL SHOW SEATS:", realSeats);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleSeatSelect(seat) {
    setSelectedSeats((current) => {
      const alreadySelected = current.some(
        (selected) => selected.id === seat.id
      );

      if (alreadySelected) {
        return current.filter(
          (selected) => selected.id !== seat.id
        );
      }

      return [...current, seat];
    });
  }

  function handleContinue() {
    if (selectedSeats.length === 0) {
      return;
    }

    navigate("/booking", {
      state: {
        show,
        selectedSeats,
      },
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-red-500" />
          Loading seats...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl">
          <Button
            variant="ghost"
            asChild
            className="mb-6 text-slate-400 hover:text-white"
          >
            <Link to="/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shows
            </Link>
          </Button>

          <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-8 text-center">
            <p className="text-red-400">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!show) {
    return null;
  }

  const total = selectedSeats.reduce(
    (sum, seat) => sum + Number(seat.price),
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <section className="border-b border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <Button
            variant="ghost"
            asChild
            className="mb-6 -ml-3 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <Link to="/shows">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shows
            </Link>
          </Button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge className="border-0 bg-red-600/10 text-red-400">
                  Select Seats
                </Badge>
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {show.movie_title}
              </h1>

              <p className="mt-2 text-slate-400">
                Choose your seats for this showtime.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <InfoItem
                icon={MapPin}
                label="Cinema"
                value={show.branch_name}
              />

              <InfoItem
                icon={Ticket}
                label="Hall"
                value={show.hall_name}
              />

              <InfoItem
                icon={CalendarDays}
                label="Date"
                value={show.show_date}
              />

              <InfoItem
                icon={Clock}
                label="Time"
                value={show.start_time}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seat Selection */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Seats */}
          <Card className="border-white/10 bg-slate-900/60 p-6">
            <div className="mb-8">
              <h2 className="text-xl font-semibold">
                Choose Your Seats
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Available seats:{" "}
                {
                  showSeats.filter(
                    (seat) => seat.status === "AVAILABLE"
                  ).length
                }
              </p>
            </div>

            <SeatGrid
              seats={showSeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
            />
          </Card>

          {/* Summary */}
          <Card className="h-fit border-white/10 bg-slate-900 p-6 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              Booking Summary
            </h2>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-500">
                  Movie
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {show.movie_title}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Cinema
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {show.branch_name}
                </p>
                <p className="text-xs text-slate-500">
                  {show.hall_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Showtime
                </p>
                <p className="mt-1 text-sm text-slate-200">
                  {show.show_date} · {show.start_time}
                </p>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-slate-500">
                  Selected Seats
                </p>

                {selectedSeats.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    No seats selected
                  </p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSeats.map((seat) => (
                      <Badge
                        key={seat.id}
                        className="border-0 bg-red-600/10 text-red-400"
                      >
                        {seat.seat_label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Total
                  </span>

                  <span className="text-xl font-bold text-white">
                    NPR {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleContinue}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Continue to Booking
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-red-500" />
        <span className="text-xs text-slate-500">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}
