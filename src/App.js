import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import Deals from "./pages/Deals";
import CarDetails from "./pages/CarDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BookingDetails from "./pages/BookingDetails";
import BookingAddons from "./pages/BookingAddons";
import BookingPayment from "./pages/BookingPayment";
import BookingConfirmation from "./pages/BookingConfirmation";
import DashboardLayout from "./pages/DashboardLayout";
import UserDashboard from "./pages/UserDashboard";
import UserProfile from "./pages/UserProfile";
import MyBookings from "./pages/MyBookings";
import BookingDetailsView from "./pages/BookingDetailsView";
import UserVerification from "./pages/UserVerification";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminFleet from "./pages/admin/Fleet";
import AdminBookings from "./pages/admin/Bookings";
import AdminUsers from "./pages/admin/Users";
import AdminReports from "./pages/admin/Reports";
import AdminPricing from "./pages/admin/Pricing";
import AdminSettings from "./pages/admin/Settings";
import AdminVerification from "./pages/AdminVerification";

// Public layout: navbar + footer wrapping public pages
function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/cars" element={<PublicLayout><Cars /></PublicLayout>} />
            <Route path="/deals" element={<PublicLayout><Deals /></PublicLayout>} />
            <Route path="/cars/:id" element={<PublicLayout><CarDetails /></PublicLayout>} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/signup" element={<PublicLayout><Signup /></PublicLayout>} />

            {/* Booking flow — requires login */}
            <Route path="/booking/:carId" element={<ProtectedRoute><PublicLayout><BookingDetails /></PublicLayout></ProtectedRoute>} />
            <Route path="/booking/:bookingId/addons" element={<ProtectedRoute><PublicLayout><BookingAddons /></PublicLayout></ProtectedRoute>} />
            <Route path="/booking/:bookingId/payment" element={<ProtectedRoute><PublicLayout><BookingPayment /></PublicLayout></ProtectedRoute>} />
            <Route path="/booking/:bookingId/confirmation" element={<ProtectedRoute><PublicLayout><BookingConfirmation /></PublicLayout></ProtectedRoute>} />

            {/* User dashboard */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<UserDashboard />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="bookings/:id" element={<BookingDetailsView />} />
              <Route path="verification" element={<UserVerification />} />
            </Route>

            {/* Admin dashboard */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="fleet" element={<AdminFleet />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="verification" element={<AdminVerification />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}
