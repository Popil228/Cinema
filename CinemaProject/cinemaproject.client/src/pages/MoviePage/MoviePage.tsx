import React, { useRef, useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import ActorCard from '../../components/Movie/ActorCard/ActorCard';
import styles from './MoviePage.module.scss';
import type { StrictMovieInfo } from '../../types/movie';
import UserMoviesContext from '../../context/userMoviesContext/UserMoviesContext';
import { getAllSessions, type SessionDto } from '../../api/sessionsApi';
import SessionItemMoviePage from '../../components/SessionItemMoviePage/SessionItemMoviePage';

const MoviePage: React.FC = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<StrictMovieInfo>({} as StrictMovieInfo);
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  
  const [movieError,setMovieError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження..."});
  const [sessionsError,setSessionsError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження..."});

  const userMoviesContext = useContext(UserMoviesContext);
  const carouselRef = useRef<HTMLDivElement>(null); //for actors scroll
  
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

  useEffect(()=>{
    const fetchData = async() => {
      //fetching movie data
      try{
        setMovie(await userMoviesContext.getMovieById(Number.parseInt(id||"0")));
        setMovieError({is:false, text:"цього не видно"});
      }
      catch(err)
      {
        console.error(err);
        setMovieError({is:true, text:"Помилка завантаженя інформації про фільм"});
        return;
      }

      //fetching sessions data
      try{
        setSessions(await getAllSessions(true, Number.parseInt(id||"0")))
        setSessionsError({is: false, text:"цього не видно"});
      }
      catch(err)
      {
        console.error(err);
        setSessionsError({is: true, text:"Помилка завантаження сеансів"});
        return;
      }

    }
    fetchData();
  },[])

  if(movieError.is)
  {
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
              {movie.extraInfo.genres.map(g=>g.name).join(', ')} | {`${movie.extraInfo.runtime} хв`} | {new Date(movie.mainInfo.releaseDate).getFullYear()}
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

      {sessionsError.is ? <h1 className={styles.movieTitle}>{sessionsError.text}</h1>
      : /*TODO: use a dedicated sessionItem component */
      <section className={styles.scheduleSection}>
        <h2 className={styles.sectionTitle}>Розклад сеансів</h2>
        <div className={styles.sessionsWrapper}>
          <div className={styles.hallColumn}>
            <h3>ЗАЛ A</h3>
            {sessions.filter(s => s.hallId==1).map(session => (
              <SessionItemMoviePage key={session.id} session={session}/>
            ))}
          </div>

          <div className={styles.hallColumn}>
            <h3>ЗАЛ B</h3>
            {sessions.filter(s => s.hallId == 1).map(session => (
              <SessionItemMoviePage key={session.id} session={session}/>
            ))}
          </div>
        </div>
      </section>
      }
    </div>
  );
};

export default MoviePage;
