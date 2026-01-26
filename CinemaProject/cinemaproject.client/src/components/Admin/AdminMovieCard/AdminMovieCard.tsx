import React from 'react';
import type { Movie } from '../../../types/movie';
import styles from './AdminMovieCard.module.scss';

interface AdminMovieCardProps extends Movie {
  onEdit?: () => void;
  onSessionsEdit?: () => void; // на майбутнє для сеансів
  onDelete?: () => void
}

const AdminMovieCard: React.FC<AdminMovieCardProps> = ({ 
  title, 
  genres, 
  posterUrl, 
  duration, 
  onEdit,
  onSessionsEdit,
  onDelete
}) => {
  return (
    <div className={styles.card}>
      <button className={styles.deleteBtn} onClick={onDelete} title="Видалити фільм">
        🗑
      </button>
      
      <div className={styles.poster}>
        <img src={posterUrl} alt={title} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.movieTitle}>{title}</h3>
        <p className={styles.meta}>
          {genres?.join(', ')} {duration ? `| ${duration}` : ''}
        </p>
        <div className={styles.actions}>
          <button onClick={onEdit} className={styles.actionBtn}>
            Фільм ✎
          </button>
          
          <button onClick={onSessionsEdit} className={styles.actionBtn}>
            Сеанси ✎
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMovieCard;