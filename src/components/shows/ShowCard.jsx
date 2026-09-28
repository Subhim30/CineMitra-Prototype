import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock,
  MapPin,
  Ticket,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ShowCard({ show }) {
  return (
    <Card className="overflow-hidden border-white/10 bg-slate-900 text-white transition-all duration-300 hover:-translate-y-1 hover:border-red-500/30 hover:shadow-lg hover:shadow-red-950/20">
      <div className="p-5">
        {/* Movie */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              {show.movie_title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {show.vendor_name}
            </p>
          </div>

          <Badge
            className={
              show.is_active
                ? "border-0 bg-green-500/10 text-green-400 hover:bg-green-500/10"
                : "border-0 bg-slate-700 text-slate-400"
            }
          >
            {show.is_active ? "Available" : "Inactive"}
          </Badge>
        </div>

        {/* Show information */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/5 p-2">
              <MapPin className="h-4 w-4 text-red-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Cinema
              </p>

              <p className="text-sm text-slate-200">
                {show.branch_name}
              </p>

              <p className="text-xs text-slate-500">
                {show.hall_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/5 p-2">
              <CalendarDays className="h-4 w-4 text-red-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Date
              </p>

              <p className="text-sm text-slate-200">
                {show.show_date}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white/5 p-2">
              <Clock className="h-4 w-4 text-red-500" />
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Showtime
              </p>

              <p className="text-sm text-slate-200">
                {show.start_time}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div>
            <p className="text-xs text-slate-500">
              Ticket Price
            </p>

            <p className="text-lg font-semibold">
              NPR {Number(show.ticket_price).toLocaleString()}
            </p>
          </div>

          <Button
            asChild
            disabled={!show.is_active}
            className="bg-red-600 hover:bg-red-700"
          >
            <Link to={`/shows/${show.id}`}>
              <Ticket className="mr-2 h-4 w-4" />
              Select Seats
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}