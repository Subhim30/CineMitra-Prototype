import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Shows from "./pages/Shows";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyBookings from "./pages/MyBookings";

import ManageMovies from "./pages/admin/ManageMovies";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";

import VendorRoute from "./components/vendor/VendorRoute";
import VendorLayout from "./components/vendor/VendorLayout";
import VendorDashboard from "./pages/vendor/Dashboard";
import VendorBranches from "./pages/vendor/Branches";
import VendorHalls from "./pages/vendor/Halls";
import VendorSeats from "./pages/vendor/Seats";


import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>

          {/* =========================
              CUSTOMER ROUTES
          ========================== */}

          <Route
            path="/"
            element={<Navigate to="/movies" replace />}
          />

          <Route
            path="/movies"
            element={<Movies />}
          />

          <Route
            path="/movies/:id"
            element={<MovieDetails />}
          />

          <Route
            path="/shows"
            element={<Shows />}
          />

          <Route
            path="/shows/:id"
            element={<SeatSelection />}
          />

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/my-bookings"
            element={<MyBookings />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />


          {/* =========================
              ADMIN ROUTES
          ========================== */}

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="movies"
                element={<ManageMovies />}
              />

              <Route
                path="shows"
                element={
                  <div className="p-10 text-white">
                    Manage Shows
                  </div>
                }
              />

              <Route
                path="bookings"
                element={
                  <div className="p-10 text-white">
                    Manage Bookings
                  </div>
                }
              />

              <Route
                path="users"
                element={
                  <div className="p-10 text-white">
                    Manage Users
                  </div>
                }
              />
            </Route>
          </Route>


          {/* =========================
              VENDOR ROUTES
          ========================== */}

          <Route element={<VendorRoute />}>
            <Route
              path="/vendor"
              element={<VendorLayout />}
            >
              <Route
                index
                element={<VendorDashboard />}
              />

              <Route
                path="branches"
                element={<VendorBranches />}
              />

              <Route
                path="halls"
                element={<VendorHalls/>}
              />

              <Route
                path="seats"
                element={<VendorSeats/>}
              />

              <Route
                path="shows"
                element={
                  <div className="p-10 text-white">
                    Manage Shows
                  </div>
                }
              />

              <Route
                path="bookings"
                element={
                  <div className="p-10 text-white">
                    Manage Bookings
                  </div>
                }
              />
            </Route>
          </Route>

        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
