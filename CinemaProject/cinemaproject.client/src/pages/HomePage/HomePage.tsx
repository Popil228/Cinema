import React, { useContext, useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import SessionItem from '../../components/SessionItem/SessionItem';
import styles from './HomePage.module.scss';
import { getAllRollingMovies } from '../../api/moviesApi';
import UserMoviesContext from '../../context/userMoviesContext/UserMoviesContext';
import { getAllSessions, type SessionDto } from '../../api/sessionsApi';

const Home: React.FC = () => {
  const rollingMovies = useContext(UserMoviesContext);
  const [sessions, setSessions] = useState<SessionDto[]>([]);

  const [rollingMoviesError,setRollingMoviesError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження..."});
  const [sessionsError,setSessionsError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження сеансів..."});

  useEffect(()=>{
    const fetchData = async() => {
      try{
        rollingMovies.setMovies(await getAllRollingMovies())
        setRollingMoviesError({is:false, text:"цього не повинно бути видно"});
      }
      catch(err)
      {
        setRollingMoviesError({is:true, text:"Фільмів в прокаті не знайдено :("});
        console.error(err);
      }

      //fetching sessions data
      try{
        setSessions(await getAllSessions(true))
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
  
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В прокаті</h2>
        { rollingMoviesError.is ? 
        <h2 className={styles.centeredTitle}>{rollingMoviesError.text}</h2> :
        <div className={styles.movieGrid}>
          {rollingMovies.movies.map(movie => (
            <MovieCard key={movie.mainInfo.id} movie={movie} />
          ))}
        </div>
        }
      </section>

      
      {sessionsError.is ? <h1 className={styles.centeredTitle}>{sessionsError.text}</h1>
      :
      <section className={styles.section}>
        <h2 className={styles.centeredTitle}>Найближчі сеанси</h2>
        
        <div className={styles.sessionsWrapper}>
          <div className={styles.hallColumn}>
            <h3>Зал А</h3>
            {sessions
              .filter(s => s.hallName === 'Зал A')
              .map(session => (
                <SessionItem 
                  session={session}

                  showDate={true}
                  showTime={true}
                />
              ))}
          </div>
          
          <div className={styles.hallColumn}>
            <h3>Зал В</h3>
            {sessions
              .filter(s => s.hallName === 'Зал B')
              .map(session => (
                <SessionItem 
                  session={session}
                  
                  showDate={true}
                  showTime={true}
                />
              ))}
          </div>
        </div>
      </section>
      }
    </>
  );
};

export default Home;