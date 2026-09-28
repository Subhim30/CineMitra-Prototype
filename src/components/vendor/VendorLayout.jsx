import { useState } from "react";
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  LogOut,
  Menu,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";

import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    name: "Dashboard",
    path: "/vendor",
    icon: BarChart3,
    end: true,
  },
  {
    name: "My Branches",
    path: "/vendor/branches",
    icon: Building2,
  },
  {
    name: "My Halls",
    path: "/vendor/halls",
    icon: Clapperboard,
  },
  {
    name: "My Seats",
    path: "/vendor/seats",
    icon: Users,
  },
  {
    name: "My Shows",
    path: "/vendor/shows",
    icon: CalendarDays,
  },
  {
    name: "My Bookings",
    path: "/vendor/bookings",
    icon: Ticket,
  },
];

export default function VendorLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* MOBILE HEADER */}
      <header className="sticky top-0 z-40 flex h-16 items-center border-b border-white/10 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/5 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="ml-3">
          <p className="font-bold">CineMitra</p>
          <p className="text-xs text-slate-500">
            Vendor Panel
          </p>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-slate-900 transition-all duration-300 ${
          collapsed ? "lg:w-20" : "lg:w-64"
        } ${
          sidebarOpen
            ? "w-72 translate-x-0"
            : "w-72 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 font-bold">
              C
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate font-bold">
                  CineMitra
                </p>
                <p className="truncate text-xs text-slate-500">
                  Vendor Panel
                </p>
              </div>
            )}
          </div>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* DESKTOP COLLAPSE */}
          <button
            type="button"
            onClick={() =>
              setCollapsed((previous) => !previous)
            }
            className="hidden rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white lg:block"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-950/20"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && (
                  <span>{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* USER */}
        <div className="border-t border-white/10 p-3">
          <div
            className={`mb-2 flex items-center gap-3 rounded-xl bg-white/[0.03] p-3 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800">
              <User className="h-4 w-4 text-slate-400" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {user?.username || "Vendor"}
                </p>

                <p className="text-xs text-red-400">
                  Vendor
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-64"
        }`}
      >
        <main className="min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
