import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { StrictMovieInfo } from '../../../types/movie';
import * as moviesApi from '../../../api/moviesApi';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';

const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  
  const [rawMovies, setRawMovies] = useState<StrictMovieInfo[]>([]);

  const mapToCardProps = (movie: StrictMovieInfo) => ({
    id: movie.mainInfo.id,
    title: movie.mainInfo.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`,
    releaseDate: movie.mainInfo.releaseDate,
    year: new Date(movie.mainInfo.releaseDate).getFullYear(),
    duration: movie.extraInfo.runtime ? `${movie.extraInfo.runtime} хв` : undefined,
    genres: movie.extraInfo.genres?.map(g => g.name),
    actors: movie.extraInfo.actors,
    description: movie.extraInfo.overview,
  });

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await moviesApi.getAllMovies(); 
        setRawMovies(data);
      } catch (err) {
        console.error("Не вдалося завантажити фільми", err);
      }
    };
    loadMovies();
  }, []);

  const handleEditRedirect = (movie: StrictMovieInfo) => {
    movieEditContext.setMovieInfo(movie);
    movieEditContext.setIsLoaded(true);
    
    localStorage.setItem("movie_edit", JSON.stringify(movie));
    
    navigate(`/admin/movies/edit/${movie.mainInfo.id}`);
  };

  const handleDeleteMovie = async (movieId: number, title: string) => {
    const confirmed = window.confirm(`Ви впевнені, що хочете видалити фільм "${title}"?`);
    
    if (confirmed) {
      try {
        await moviesApi.deleteMovieById(movieId);
        setRawMovies(prev => prev.filter(m => m.mainInfo.id !== movieId));
        alert("Фільм успішно видалено");
      } catch (err) {
        console.error("Помилка при видаленні:", err);
        alert("Не вдалося видалити фільм");
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Фільми ({rawMovies.length})</h1>
        <button 
          className={styles.addBtn} 
          onClick={() => navigate('/admin/movies/search')}
        >
          +
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В прокаті</h2>
        <div className={styles.grid}>
          {rawMovies.map(movie => (
            <AdminMovieCard 
              key={movie.mainInfo.id} 
              {...mapToCardProps(movie)} 
              onEdit={() => handleEditRedirect(movie)}
              onDelete={() => handleDeleteMovie(movie.mainInfo.id, movie.mainInfo.title)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminMoviesPage;
