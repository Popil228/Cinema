import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { Movie } from '../../../types/movie';

const AdminMoviesPage: React.FC = () => {
  const navigate = useNavigate();

  const activeMovies: Movie[] = [
    { 
      id: 1, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'],
      duration: '2г 30хв', 
      posterUrl: '/Minecraft.png',
      year: 2024
    },
    { 
      id: 2, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'], 
      duration: '2г 30хв', 
      posterUrl: '/Minecraft.png' 
    },
    { 
      id: 3, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'], 
      duration: '2г 30хв', 
      posterUrl: '/Minecraft.png' 
    },
  ];

  // Дані для архіву
  const archivedMovie: Movie = {
    id: 10,
    title: "Minecraft", 
    genres: ["Фантастика", "Пригоди"], 
    duration: "2г 30хв", 
    posterUrl: "/Minecraft.png" 
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Фільми</h1>
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
          {activeMovies.map(movie => (
            <AdminMovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Архів</h2>
        <div className={styles.grid}>
          <AdminMovieCard {...archivedMovie} />
        </div>
      </section>
    </div>
  );
};

export default AdminMoviesPage;