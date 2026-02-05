import React, { useContext } from 'react';
import styles from './SessionItemMoviePage.module.scss';
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';
import type { SessionDto } from '../../api/sessionsApi';
import { Link } from 'react-router-dom';
import BookingPageContext from '../../context/bookingPageContext/BookingPageContext';

const SessionItemMoviePage: React.FC<{session: SessionDto}> = ({ session }) => {
  const startDate = new Date(session.startTime)
  const postetUri = `https://image.tmdb.org/t/p/w500${session.moviePosterPath}`;
  const dateStr:string = dateToDayMonthStrUA(startDate);
  const timeStr:string = startDate.toTimeString().slice(0,5);

  const bookingPageContext = useContext(BookingPageContext);
  
  const onLinkClick = () => {
    bookingPageContext.setSelectedSession(session);
  }

  return (
    <Link to={`/booking/${session.id}`} className={styles.muteLinkEffect} onClick={onLinkClick}>
    <div key={session.id} className={styles.clientSessionCard}>
      <img src={postetUri} alt={session.movieTitle} className={styles.miniPoster} />
      <div className={styles.cardInfo}>
        <p className={styles.sessionTitle}>{session.movieTitle}</p>
        <div className={styles.sessionTags}>
          <span>{session.hallName}</span>
          <span>{dateStr}</span>
          <span>{timeStr}</span>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default SessionItemMoviePage;