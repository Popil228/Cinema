import React from 'react';
import type { SessionDto } from '../../../api/sessionsApi';
import styles from './AdminSessionCard.module.scss';
import { dateToDayMonthStrUA } from '../../../utilities/dateToStringUA';

interface AdminSessionCardProps {
  session: SessionDto;
  onDelete: () => void;
}

const AdminSessionCard: React.FC<AdminSessionCardProps> = ({ session, onDelete }) => {
  const { movieTitle, hallName, startTime, moviePosterPath } = session;
  
  // Форматуємо дату та час
  const dateObj = new Date(startTime);
  const date = dateObj.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
  const time = dateObj.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  
  const posterUrl = moviePosterPath 
    ? `https://image.tmdb.org/t/p/w200${moviePosterPath}` 
    : '/placeholder.png';

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.miniPoster}>
          <img src={posterUrl} alt={movieTitle} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{movieTitle}</h3>
          <div className={styles.tags}>
            <span className={styles.tag}>{hallName}</span>
            <span className={styles.tag}>{date}</span>
            <span className={styles.tag}>{time}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.deleteBtn} onClick={onDelete}>✕</button>
        <button className={styles.editBtn}>✎</button>
      </div>
    </div>
  );
};

export default AdminSessionCard;