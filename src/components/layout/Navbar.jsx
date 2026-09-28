import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Film,
  Menu,
  Search,
  Ticket,
  User,
  X,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(event) {
    event.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/movies");
      return;
    }

    navigate(`/movies?search=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/movies");
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/movies"
          onClick={closeMobileMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600">
            <Film className="h-5 w-5 text-white" />
          </div>

          <span className="text-xl font-bold tracking-tight text-white">
            Cine<span className="text-red-500">Mitra</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem to="/movies">Movies</NavItem>
          <NavItem to="/shows">Shows</NavItem>

          {isAuthenticated && (
            <NavItem
              to="/my-bookings"
              icon={<Ticket className="h-4 w-4" />}
            >
              My Bookings
            </NavItem>
          )}
        </nav>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="ml-auto hidden w-full max-w-xs lg:block"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search movies..."
              className="h-9 border-white/10 bg-white/5 pl-9 text-sm text-white placeholder:text-slate-500 focus-visible:ring-red-500"
            />
          </div>
        </form>

        {/* Desktop Account */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600/20">
                  <User className="h-4 w-4 text-red-400" />
                </div>

                <span className="max-w-[120px] truncate text-sm font-medium text-slate-200">
                  {user?.username || "User"}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                className="text-slate-300 hover:bg-white/5 hover:text-white"
              >
                Login
              </Button>

              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                className="bg-red-600 hover:bg-red-700"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-slate-950 px-4 py-4 md:hidden">
          <div className="space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search movies..."
                  className="border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-500 focus-visible:ring-red-500"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="grid gap-1">
              <MobileNavItem
                to="/movies"
                onClick={closeMobileMenu}
              >
                Movies
              </MobileNavItem>

              <MobileNavItem
                to="/shows"
                onClick={closeMobileMenu}
              >
                Shows
              </MobileNavItem>

              {isAuthenticated && (
                <MobileNavItem
                  to="/my-bookings"
                  onClick={closeMobileMenu}
                >
                  <span className="flex items-center gap-2">
                    <Ticket className="h-4 w-4" />
                    My Bookings
                  </span>
                </MobileNavItem>
              )}
            </nav>

            {/* Mobile Account */}
            <div className="border-t border-white/10 pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/20">
                      <User className="h-4 w-4 text-red-400" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">
                        Signed in as
                      </p>

                      <p className="truncate text-sm font-medium text-white">
                        {user?.username || "User"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full border-white/10 bg-transparent text-slate-300 hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      closeMobileMenu();
                    }}
                    className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    Login
                  </Button>

                  <Button
                    onClick={() => {
                      navigate("/signup");
                      closeMobileMenu();
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ to, children, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-red-600/10 text-red-400"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
  );
}

function MobileNavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `block rounded-lg px-3 py-3 text-sm font-medium transition ${
          isActive
            ? "bg-red-600/10 text-red-400"
            : "text-slate-400 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}
