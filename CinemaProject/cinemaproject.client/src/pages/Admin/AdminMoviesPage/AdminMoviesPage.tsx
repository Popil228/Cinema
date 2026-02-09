import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { StrictMovieInfo } from '../../../types/movie';
import * as moviesApi from '../../../api/moviesApi';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';

const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  
  const [allMovies, setAllMovies] = useState<StrictMovieInfo[]>([]);
  const [nowShowing, setNowShowing] = useState<StrictMovieInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [allData, showingData] = await Promise.all([
          moviesApi.getAllMovies(),
          moviesApi.getAllNowShowingMovies()
        ]);
        setAllMovies(allData);
        setNowShowing(showingData);
      } catch (err) {
        console.error("Не вдалося завантажити фільми", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNowShowing = useMemo(() => {
    return nowShowing.filter(movie => 
      movie.mainInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [nowShowing, searchTerm]);

  const otherMovies = useMemo(() => {
    const nowShowingIds = new Set(nowShowing.map(m => m.mainInfo.id));
    return allMovies.filter(movie => 
      !nowShowingIds.has(movie.mainInfo.id) &&
      movie.mainInfo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allMovies, nowShowing, searchTerm]);

  const handleEditRedirect = (movie: StrictMovieInfo) => {
    movieEditContext.setMovieInfo(movie);
    movieEditContext.setIsLoaded(true);
    localStorage.setItem("movie_edit", JSON.stringify(movie));
    navigate(`/admin/movies/edit/${movie.mainInfo.id}`);
  };

  const handleDeleteMovie = async (movieId: number, title: string) => {
    if (window.confirm(`Ви впевнені, що хочете видалити фільм "${title}"?`)) {
      try {
        await moviesApi.deleteMovieById(movieId);
        setAllMovies(prev => prev.filter(m => m.mainInfo.id !== movieId));
        setNowShowing(prev => prev.filter(m => m.mainInfo.id !== movieId));
        alert("Фільм успішно видалено");
      } catch (err) {
        alert("Не вдалося видалити фільм");
      }
    }
  };

  if (isLoading) return <div className={styles.loader}>Завантаження фільмів...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Фільми ({allMovies.length})</h1>
          <div className={styles.searchWrapper}>
            <input 
              type="text" 
              placeholder="Пошук за назвою..." 
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          className={styles.addBtn} 
          onClick={() => navigate('/admin/movies/search')}
          title="Додати новий фільм"
        >
          +
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          🔥 В прокаті ({filteredNowShowing.length})
        </h2>
        {filteredNowShowing.length > 0 ? (
          <div className={styles.grid}>
            {filteredNowShowing.map(movie => (
              <AdminMovieCard 
                key={movie.mainInfo.id} 
                {...mapToCardProps(movie)} 
                onEdit={() => handleEditRedirect(movie)}
                onDelete={() => handleDeleteMovie(movie.mainInfo.id, movie.mainInfo.title)}
              />
            ))}
          </div>
        ) : (
          <p className={styles.emptyText}>Немає активних фільмів із сеансами.</p>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          📂 Всі інші фільми ({otherMovies.length})
        </h2>
        <div className={styles.grid}>
          {otherMovies.map(movie => (
            <AdminMovieCard 
              key={movie.mainInfo.id} 
              {...mapToCardProps(movie)} 
              onEdit={() => handleEditRedirect(movie)}
              onDelete={() => handleDeleteMovie(movie.mainInfo.id, movie.mainInfo.title)}
            />
          ))}
        </div>
        {otherMovies.length === 0 && searchTerm && (
          <div className={styles.emptySearch}>
            Нічого не знайдено за запитом "{searchTerm}"
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminMoviesPage;