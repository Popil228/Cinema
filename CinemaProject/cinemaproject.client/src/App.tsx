import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout.tsx";

import HomePage from "./pages/HomePage/HomePage.tsx";
import SchedulePage from "./pages/SchedulePage/SchedulePage.tsx";
import MoviePage from "./pages/MoviePage/MoviePage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import EmailConfirmationPage from "./pages/RegisterPage/EmailConfirmationPage.tsx";
import BookingPage from "./pages/BookingPage/BookingPage.tsx";
import ProfilePage from "./pages/ProfilePage/ProfilePage.tsx";
import MyBookingsPage from "./pages/MyBookingsPage/MyBookingsPage.tsx";
import TicketDetailsPage from "./pages/MyBookingsPage/TicketDetailsPage.tsx";

import AdminMoviesPage from "./pages/Admin/AdminMoviesPage/AdminMoviesPage.tsx";
import AdminSessionsPage from "./pages/Admin/AdminSessionsPage/AdminSessionsPage.tsx";
import EditMoviePage from "./pages/Admin/EditMoviePage/EditMoviePage.tsx";
import AddMoviePage from "./pages/Admin/AddMoviePage/AddMoviePage.tsx";
import SearchBarContextProvider from "./context/searchBarContext/SearchBarContextProvider.tsx";
import SearchMoviePage from "./pages/Admin/SearchMoviePage/SearchMoviePage.tsx";
import AdminBookingsPage from "./pages/Admin/AdminBookingsPage/AdminBookingsPage.tsx";

import ProtectedRoute from "./components/Common/ProtectedRoute.tsx";
import AuthProvider from "./context/authContext/AuthContext";
import AdminDiscountPage from "./pages/Admin/AdminDiscountPage/AdminDiscountPage.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/schedule"
              element={
                <SearchBarContextProvider>
                  {" "}
                  <SchedulePage />{" "}
                </SearchBarContextProvider>
              }
            />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/confirm-email" element={<EmailConfirmationPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/my-bookings" element={<MyBookingsPage />} />
              <Route path="/profile/tickets" element={<TicketDetailsPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminMoviesPage />} />
              <Route path="movies" element={<AdminMoviesPage />} />
              <Route path="movies/search" element={<SearchMoviePage />} />
              <Route path="movies/add" element={<AddMoviePage />} />
              <Route path="movies/edit/:id" element={<EditMoviePage />} />
              <Route path="sessions" element={<AdminSessionsPage />} />
              <Route path="discounts" element={<AdminDiscountPage />} />
              <Route path="bookings" element={<AdminBookingsPage />} />
            </Route>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;