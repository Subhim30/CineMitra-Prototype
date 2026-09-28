import {
  CalendarDays,
  DollarSign,
  MapPin,
  Ticket,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

const stats = [
  {
    title: "My Branches",
    value: "—",
    description: "Active branches",
    icon: MapPin,
  },
  {
    title: "My Shows",
    value: "—",
    description: "Scheduled shows",
    icon: CalendarDays,
  },
  {
    title: "Bookings",
    value: "—",
    description: "Total bookings",
    icon: Ticket,
  },
  {
    title: "Revenue",
    value: "—",
    description: "Total ticket revenue",
    icon: DollarSign,
  },
];

export default function VendorDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}
        <div>
          <p className="text-sm font-medium text-red-500">
            Vendor Dashboard
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.username || "Vendor"} 👋
          </h1>

          <p className="mt-2 text-slate-400">
            Manage your cinemas, shows, seats, and bookings
            from one place.
          </p>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="border-white/10 bg-slate-900"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {stat.title}
                      </p>

                      <p className="mt-2 text-3xl font-bold text-white">
                        {stat.value}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {stat.description}
                      </p>
                    </div>

                    <div className="rounded-xl bg-red-500/10 p-3">
                      <Icon className="h-5 w-5 text-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* BOOKING OVERVIEW */}
          <Card className="border-white/10 bg-slate-900 lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-white">
                    Booking Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Your booking activity will appear here.
                  </p>
                </div>

                <CalendarDays className="h-5 w-5 text-slate-500" />
              </div>

              <div className="mt-8 flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/50">
                <p className="text-sm text-slate-600">
                  Analytics will be connected to Django
                  shortly.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="border-white/10 bg-slate-900">
            <CardContent className="p-6">
              <h2 className="font-semibold text-white">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Common vendor actions
              </p>

              <div className="mt-6 space-y-3">
                <QuickAction
                  href="/vendor/branches"
                  title="Manage Branches"
                  icon={MapPin}
                />

                <QuickAction
                  href="/vendor/shows"
                  title="Manage Shows"
                  icon={CalendarDays}
                />

                <QuickAction
                  href="/vendor/bookings"
                  title="View Bookings"
                  icon={Ticket}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RECENT ACTIVITY */}
        <Card className="border-white/10 bg-slate-900">
          <CardContent className="p-6">
            <h2 className="font-semibold text-white">
              Recent Activity
            </h2>

            <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-8 text-center">
              <p className="text-sm text-slate-600">
                Recent vendor activity will appear here.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

function QuickAction({
  href,
  title,
  icon: Icon,
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-950 p-4 transition hover:border-red-500/30 hover:bg-white/[0.03]"
    >
      <div className="rounded-lg bg-red-500/10 p-2">
        <Icon className="h-4 w-4 text-red-500" />
      </div>

      <span className="text-sm font-medium text-slate-300">
        {title}
      </span>
    </a>
  );
}