import React from 'react';
import styles from './SessionItem.module.scss';
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';
import type { SessionDto } from '../../api/sessionsApi';

interface SessionItemProps {
  session:SessionDto;

  showDate: boolean;
  showTime: boolean;
}

const SessionItem: React.FC<SessionItemProps> = ({ session, showTime=false, showDate=false }) => {
  const genresString = session.movieGenres?.join(', ') || 'Жанр не вказано';
  const startDate = new Date(session.startTime)
  const postetUri = `https://image.tmdb.org/t/p/w500${session.moviePosterPath}`;
  const dateStr:string = dateToDayMonthStrUA(startDate);
  const timeStr:string = startDate.toTimeString().slice(0,5);
  
  return (
    <div className={styles.sessionCard}>
      <div className={styles.leftInfo}>
        <div className={styles.poster}>
          <img src={postetUri} alt={session.movieTitle} />
        </div>
        <div className={styles.movieDetails}>
          <h4 className={styles.movieTitle}>{session.movieTitle}</h4>
          <p className={styles.genres}>{genresString}</p>
        </div>
      </div>
      
      <div className={styles.rightInfo}>
        {showDate && <div className={styles.badge}>{dateStr}</div>}
        {showTime && <div className={styles.badge}>{timeStr}</div>}
      </div>
    </div>
  );
};

export default SessionItem;