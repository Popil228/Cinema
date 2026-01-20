import React from 'react';
import type { Movie } from '../../../types/movie';
import styles from './AdminMovieCard.module.scss';

const AdminMovieCard: React.FC<Movie> = ({ title, genres, posterUrl, duration }) => {
  return (
    <div className={styles.card}>
      <div className={styles.poster}>
        <img src={posterUrl} alt={title} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.movieTitle}>{title}</h3>
        <p className={styles.meta}>
          {genres?.join(', ')} {duration ? `| ${duration}` : ''}
        </p>
        <div className={styles.actions}>
          <button className={styles.actionBtn}>Фільм ✎</button>
          <button className={styles.actionBtn}>Сеанси ✎</button>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;