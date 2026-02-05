import React from 'react';
import { Link } from 'react-router-dom';
import type { StrictMovieInfo } from '../../types/movie';
import styles from './MovieCard.module.scss';

interface Props {
  movie: StrictMovieInfo;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const posterLink = `https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`

  return (
    <Link to={`/movie/${movie.mainInfo.id}`} className={styles.card}>
      <div className={styles.poster}>
        {/* {movie.mainInfo.posterPath ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <span className={styles.placeholderText}>Постер</span>
        )} */}
        <img src={posterLink} alt={movie.mainInfo.title} />
        <div className={styles.overlay}>
          <h3 className={styles.title}>{movie.mainInfo.title}</h3>
          <p className={styles.date}>{`${movie.extraInfo.runtime} хв`}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;