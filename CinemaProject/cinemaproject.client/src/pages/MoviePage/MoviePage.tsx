import React, { useRef, useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActorCard from '../../components/Movie/ActorCard/ActorCard';
import styles from './MoviePage.module.scss';
import type { Session, StrictMovieInfo } from '../../types/movie';
// Імпортуємо утиліту колеги
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';
import UserMoviesContext from '../../context/userMoviesContext/UserMoviesContext';

const MoviePage: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<StrictMovieInfo>({} as StrictMovieInfo);
  const [movieError, setMovieError] = useState<{ is: boolean, text: string }>({ is: true, text: "Завантаження..." });
  const userMoviesContext = useContext(UserMoviesContext);
  const carouselRef = useRef<HTMLDivElement>(null); //for actors scroll

  // Сеанси для цього фільму
  const sessions: Session[] = [
    { id: 1, title: 'Minecraft', hall: 'A', date: new Date(2026, 3, 3), time: '13:00', imageUrl: '/Minecraft.png' },
    { id: 2, title: 'Minecraft', hall: 'A', date: new Date(2026, 3, 3), time: '16:00', imageUrl: '/Minecraft.png' },
    { id: 3, title: 'Minecraft', hall: 'B', date: new Date(2026, 3, 3), time: '14:30', imageUrl: '/Minecraft.png' },
    { id: 4, title: 'Minecraft', hall: 'B', date: new Date(2026, 3, 3), time: '19:00', imageUrl: '/Minecraft.png' },
  ];

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [!movieError.is]); //triggered when info is loaded

  useEffect(() => {
    const fetchData = async () => {
      try {
        setMovie(await userMoviesContext.getMovieById(Number.parseInt(id || "0")));
        setMovieError({ is: false, text: "цього не видно" });
      }
      catch (err) {
        console.error(err);
        setMovieError({ is: true, text: "Помилка завантаженя інформації про фільм" });
        return;
      }


    }
    fetchData();

  }, [])

  if (movieError.is) {
    return (
      <div className={styles.pageWrapper}>
        <h1 className={styles.movieTitle}>{movieError.text}</h1>
      </div>
    )
  }

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.mainInfo}>
        <div className={styles.contentContainer}>
          <div className={styles.posterSide}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`} alt={movie.mainInfo.title} className={styles.mainPoster} />
          </div>

          <div className={styles.detailsSide}>
            <h1 className={styles.movieTitle}>{movie.mainInfo.title}</h1>
            <p className={styles.metaInfo}>
              {movie.extraInfo.genres.map(g => g.name).join(', ')} | {`${movie.extraInfo.runtime} хв`} | {new Date(movie.mainInfo.releaseDate).getFullYear()}
            </p>

            <div className={styles.actorsBlock}>
              <h2 className={styles.subTitle}>Актори</h2>
              <div className={styles.actorsCarousel} ref={carouselRef}>
                {movie.extraInfo.actors.map((actor, index) => (
                  <ActorCard key={index} {...actor} />
                ))}
              </div>
            </div>

            <button className={styles.buyBtn}>Забронювати місце</button>

            <div className={styles.descriptionBlock}>
              <h2 className={styles.subTitle}>Опис</h2>
              <p className={styles.descriptionText}>{movie.extraInfo.overview}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Розклад сеансів</h2>
        <div className={styles.sessionsWrapper}>

          <div className={styles.hallColumn}>
            <h3>ЗАЛ А</h3>
            {sessions.filter(s => s.hall === 'A').map(session => (
              <div key={session.id} className={styles.clientSessionCard}>
                <img src={session.imageUrl} alt={session.title} className={styles.miniPoster} />
                <div className={styles.cardInfo}>
                  <p className={styles.sessionTitle}>{session.title}</p>
                  <div className={styles.sessionTags}>
                    <span>ЗАЛ {session.hall}</span>
                    <span>{dateToDayMonthStrUA(session.date)}</span>
                    <span>{session.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.hallColumn}>
            <h3>ЗАЛ В</h3>
            {sessions.filter(s => s.hall === 'B').map(session => (
              <div key={session.id} className={styles.clientSessionCard}>
                <img src={session.imageUrl} alt={session.title} className={styles.miniPoster} />
                <div className={styles.cardInfo}>
                  <p className={styles.sessionTitle}>{session.title}</p>
                  <div className={styles.sessionTags}>
                    <span>ЗАЛ {session.hall}</span>
                    <span>{dateToDayMonthStrUA(session.date)}</span>
                    <span>{session.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
};

export default MoviePage;
