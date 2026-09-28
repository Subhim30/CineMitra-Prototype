import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Film,
  LayoutDashboard,
  LogOut,
  Menu,
  Ticket,
  Users,
  X,
  Clapperboard,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/movies");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex h-16 items-center border-b border-white/10 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen((current) => !current)}
          className="text-slate-300"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        <div className="ml-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
            <Film className="h-4 w-4" />
          </div>

          <span className="font-bold">
            Cine<span className="text-red-500">Mitra</span>
          </span>
        </div>
      </header>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-950 transition-transform duration-200 lg:static lg:translate-x-0 ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            {/* Brand */}
            <div className="flex h-16 items-center border-b border-white/10 px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
                  <Film className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-bold">
                    Cine<span className="text-red-500">Mitra</span>
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    Admin Panel
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
              <AdminNavItem
                to="/admin"
                icon={LayoutDashboard}
                onClick={() => setMobileOpen(false)}
              >
                Dashboard
              </AdminNavItem>

              <AdminNavItem
                to="/admin/movies"
                icon={Film}
                onClick={() => setMobileOpen(false)}
              >
                Manage Movies
              </AdminNavItem>

              <AdminNavItem
                to="/admin/shows"
                icon={Clapperboard}
                onClick={() => setMobileOpen(false)}
              >
                Manage Shows
              </AdminNavItem>

              <AdminNavItem
                to="/admin/bookings"
                icon={Ticket}
                onClick={() => setMobileOpen(false)}
              >
                Manage Bookings
              </AdminNavItem>

              <AdminNavItem
                to="/admin/users"
                icon={Users}
                onClick={() => setMobileOpen(false)}
              >
                Manage Users
              </AdminNavItem>
            </nav>

            {/* User section */}
            <div className="border-t border-white/10 p-4">
              <div className="mb-3 rounded-lg bg-white/5 p-3">
                <p className="text-xs text-slate-500">
                  Signed in as
                </p>

                <p className="mt-1 truncate text-sm font-medium">
                  {user?.username || "Administrator"}
                </p>

                <p className="mt-1 text-xs text-red-400">
                  Administrator
                </p>
              </div>

              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <button
            type="button"
            aria-label="Close admin menu"
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({
  to,
  icon: Icon,
  children,
  onClick,
}) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? "bg-red-600/10 text-red-400"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {children}
    </NavLink>
  );
}
