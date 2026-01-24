import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { Movie, StrictMovieInfo } from '../../../types/movie';
import * as movieApi from '../../../api/movieApi';

const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);

  const mapStrictMovieToMovie = (
    movie: StrictMovieInfo
  ): Movie => ({
    id: movie.mainInfo.id,
    title: movie.mainInfo.title,
    posterUrl: `https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`,
    releaseDate: movie.mainInfo.releaseDate,
    year: new Date(movie.mainInfo.releaseDate).getFullYear(),

    duration: movie.extraInfo.runtime
      ? `${movie.extraInfo.runtime} хв`
      : undefined,

    genres: movie.extraInfo.genres?.map(g => g.name),
    actors: movie.extraInfo.actors,
    description: movie.extraInfo.overview,
  });

  useEffect(() => {
    const loadMovies = async () => {
      const data = await movieApi.getAllMovies(); 
      setMovies(data.map(mapStrictMovieToMovie));
    };

    loadMovies();
  }, []);
 

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
        <div className={styles.grid}>
          {movies.map(movie => (
            <AdminMovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      {/*<section className={styles.section}>
        <h2 className={styles.sectionTitle}>Архів</h2>
        <div className={styles.grid}>
          {movies.map(movie => (
            <AdminMovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>*/}
    </div>
  );
};

export default AdminMoviesPage;
