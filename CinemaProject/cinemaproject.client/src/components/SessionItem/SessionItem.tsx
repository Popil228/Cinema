import React from 'react';
import styles from './SessionItem.module.scss';

interface SessionItemProps {
  title: string;
  genres?: string[];
  date: string;
  time: string;
  imageUrl: string;
}

const SessionItem: React.FC<SessionItemProps> = ({ title, genres, date, time, imageUrl }) => {
  const genresString = genres?.join(', ') || 'Жанр не вказано';

  return (
    <div className={styles.sessionCard}>
      <div className={styles.leftInfo}>
        <div className={styles.poster}>
          <img src={imageUrl} alt={title} />
        </div>
        <div className={styles.movieDetails}>
          <h4 className={styles.movieTitle}>{title}</h4>
          <p className={styles.genres}>{genresString}</p>
        </div>
      </div>
      
      <div className={styles.rightInfo}>
        <div className={styles.badge}>{date}</div>
        <div className={styles.badge}>{time}</div>
      </div>
    </div>
  );
};

export default SessionItem;