import React from 'react';
import { Link } from 'react-router-dom'; // Додаємо імпорт Link
import type { Movie } from '../../types/movie';
import styles from './MovieCard.module.scss';

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.id}`} className={styles.card}>
      <div className={styles.poster}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <span className={styles.placeholderText}>Постер</span>
        )}
  
        <div className={styles.overlay}>
          <h3 className={styles.title}>{movie.title}</h3>
          <p className={styles.date}>{movie.releaseDate || '01/01 - 01/02'}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;