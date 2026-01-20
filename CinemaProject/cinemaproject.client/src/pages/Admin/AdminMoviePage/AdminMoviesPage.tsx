import React from 'react';
import AdminMovieCard from '../../../components/Admin/AdminMovieCard/AdminMovieCard';
import styles from './AdminMoviesPage.module.scss';
import type { Movie } from '../../../types/movie';

const AdminMoviesPage: React.FC = () => {
  const activeMovies: Movie[] = [
    { 
      id: 1, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'],
      duration: '2г 30хв', 
      posterUrl: '/path-to-img.jpg',
      year: 2024
    },
    { 
      id: 2, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'], 
      duration: '2г 30хв', 
      posterUrl: '/path-to-img.jpg' 
    },
    { 
      id: 3, 
      title: 'Minecraft', 
      genres: ['Фантастика', 'Пригоди'], 
      duration: '2г 30хв', 
      posterUrl: '/path-to-img.jpg' 
    },
  ];

  const archivedMovie: Movie = {
    id: 10,
    title: "Minecraft", 
    genres: ["Фантастика", "Пригоди"], 
    duration: "2г 30хв", 
    posterUrl: "/path-to-img.jpg" 
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Фільми</h1>
        <button className={styles.addBtn}>+</button>
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