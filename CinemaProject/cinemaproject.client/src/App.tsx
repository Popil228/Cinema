import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import HomePage from "./pages/HomePage/HomePage";
import SchedulePage from "./pages/SchedulePage/SchedulePage";
import MoviePage from "./pages/MoviePage/MoviePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/movie/:id" element={<MoviePage />} />
        </Route>

        {/* Сюди можна буде додати AuthLayout для сторінок Login/Register */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;