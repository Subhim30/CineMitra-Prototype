import {
  CalendarDays,
  Clapperboard,
  Film,
  Ticket,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import { useAuth } from "../../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-white/10 bg-slate-950/80">
        <div className="px-6 py-8 lg:px-10">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-500">
            Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Welcome back, {user?.username || "Administrator"}.
            Manage CineMitra from here.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8 p-6 lg:p-10">
        {/* Stats */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Movies"
            value="—"
            description="Movies in the system"
            icon={Film}
          />

          <StatCard
            title="Total Shows"
            value="—"
            description="Scheduled showtimes"
            icon={CalendarDays}
          />

          <StatCard
            title="Bookings"
            value="—"
            description="Customer bookings"
            icon={Ticket}
          />

          <StatCard
            title="Users"
            value="—"
            description="Registered customers"
            icon={Users}
          />
        </div>

        {/* Quick Actions */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-white">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage the main parts of CineMitra.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <QuickAction
              icon={Film}
              title="Manage Movies"
              description="Add, edit, and remove movies."
              href="/admin/movies"
            />

            <QuickAction
              icon={Clapperboard}
              title="Manage Shows"
              description="Create and manage movie showtimes."
              href="/admin/shows"
            />

            <QuickAction
              icon={Ticket}
              title="Manage Bookings"
              description="View customer ticket bookings."
              href="/admin/bookings"
            />

            <QuickAction
              icon={Users}
              title="Manage Users"
              description="View registered CineMitra users."
              href="/admin/users"
            />
          </div>
        </section>

        {/* Activity placeholder */}
        <Card className="border-white/10 bg-slate-900/60 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-600/10 p-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h2 className="font-semibold">
                Dashboard Overview
              </h2>

              <p className="text-sm text-slate-500">
                Live statistics will appear here once the admin
                API endpoints are connected.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <Card className="border-white/10 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {description}
          </p>
        </div>

        <div className="rounded-lg bg-red-600/10 p-2.5">
          <Icon className="h-5 w-5 text-red-500" />
        </div>
      </div>
    </Card>
  );
}

function QuickAction({
  icon: Icon,
  title,
  description,
  href,
}) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-red-500/30 hover:bg-slate-900"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/10">
        <Icon className="h-5 w-5 text-red-500" />
      </div>

      <h3 className="mt-4 font-semibold text-white group-hover:text-red-400">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </a>
  );
}
