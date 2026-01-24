import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { Movie } from '../../../types/movie';
import { getAllMovies } from '../../../api/moviesApi';

const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllMovies();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження');
    } finally {
      setLoading(false);
    }
  };

  // Розділяємо на активні та архівні (поки все активне)
  const activeMovies = movies;
  const archivedMovies: Movie[] = [];

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Завантаження...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>{error}</p>
        <button onClick={loadMovies} className={styles.retryBtn}>Спробувати знову</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Фільми ({movies.length})</h1>
        <button 
          className={styles.addBtn} 
          onClick={() => navigate('/admin/movies/search')}
        >
          +
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В прокаті</h2>
        {activeMovies.length > 0 ? (
          <div className={styles.grid}>
            {activeMovies.map(movie => (
              <AdminMovieCard key={movie.id} {...movie} />
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>Немає фільмів. Додайте через TMDB імпорт.</p>
        )}
      </section>

      {archivedMovies.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Архів</h2>
          <div className={styles.grid}>
            {archivedMovies.map(movie => (
              <AdminMovieCard key={movie.id} {...movie} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AdminMoviesPage;