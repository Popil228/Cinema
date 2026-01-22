import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout.tsx";

import HomePage from "./pages/HomePage/HomePage.tsx";
import SchedulePage from "./pages/SchedulePage/SchedulePage.tsx";
import MoviePage from "./pages/MoviePage/MoviePage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.tsx";
import EmailConfirmationPage from "./pages/RegisterPage/EmailConfirmationPage.tsx";

import AdminMoviesPage from "./pages/Admin/AdminMoviesPage/AdminMoviesPage.tsx";
import AdminSessionsPage from "./pages/Admin/AdminSessionsPage/AdminSessionsPage.tsx";
import EditMoviePage from "./pages/Admin/EditMoviePage/EditMoviePage.tsx";
import SearchBarContextProvider from "./context/searchBarContext/SearchBarContextProvider.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SearchBarContextProvider> <SchedulePage /> </SearchBarContextProvider>} />
          <Route path="/movie/:id" element={<MoviePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-email" element={<EmailConfirmationPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminMoviesPage />} />
          <Route path="movies" element={<AdminMoviesPage />} />
          <Route path="movies/add" element={<EditMoviePage />} />
          <Route path="movies/edit/:id" element={<EditMoviePage />} />
          <Route path="sessions" element={<AdminSessionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;