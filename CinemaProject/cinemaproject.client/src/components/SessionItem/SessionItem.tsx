import React from 'react';
import styles from './SessionItem.module.scss';
import type { Session } from '../../types/movie';

interface SessionItemProps {
  session:Session;

  showDate: boolean;
  showTime: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, showTime=false, showDate=false }) => {
  const genresString = session.genres?.join(', ') || 'Жанр не вказано';

  return (
    <div className={styles.sessionCard}>
      <div className={styles.leftInfo}>
        <div className={styles.poster}>
          <img src={session.imageUrl} alt={session.title} />
        </div>
        <div className={styles.movieDetails}>
          <h4 className={styles.movieTitle}>{session.title}</h4>
          <p className={styles.genres}>{genresString}</p>
        </div>
      </div>
      
      <div className={styles.rightInfo}>
        {showDate && <div className={styles.badge}>{session.date}</div>}
        {showTime && <div className={styles.badge}>{session.time}</div>}
      </div>
    </div>
  );
};

export default SessionItem;