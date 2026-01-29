import React, { useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import SessionItem from '../../components/SessionItem/SessionItem';
import styles from './HomePage.module.scss';
import { useFutureSessions, useNowShowingMovies } from '../../hooks/ReactQueryHooks';

const Home: React.FC = () => {
  const nowShowingMovies = useNowShowingMovies();
  const sessions = useFutureSessions();

  const [nowShowingMoviesError,setRollingMoviesError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження..."});
  const [sessionsError,setSessionsError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження сеансів..."});

  useEffect(()=>{
    const fetchData = async() => {
      //fetching movie data
      if(nowShowingMovies.isSuccess)
      {
        setRollingMoviesError({is: false, text:"цього не видно"});
      }
      else if(nowShowingMovies.isError)
      {
        console.error(nowShowingMovies.error.message);
        setRollingMoviesError({is: true, text:"Помилка завантаження фільмів"});
        return;
      }


      //fetching sessions data
      if(sessions.isSuccess)
      {
        setSessionsError({is: false, text:"цього не видно"});
      }
      else if(sessions.isError)
      {
        console.error(sessions.error.message);
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
        { !nowShowingMovies.isSuccess ? 
        <h2 className={styles.alertMessage}>{nowShowingMoviesError.text}</h2> :
        <div className={styles.movieGrid}>
          {(nowShowingMovies.data || []).map(movie => (
            <MovieCard key={movie.mainInfo.id} movie={movie} />
          ))}
        </div>
        }
      </section>

      
      {!sessions.isSuccess ? <h1 className={styles.alertMessage}>{sessionsError.text}</h1>
      :
      <section className={styles.section}>
        <h2 className={styles.centeredTitle}>Найближчі сеанси</h2>
        
        <div className={styles.sessionsWrapper}>
          <div className={styles.hallColumn}>
            <h3>Зал А</h3>
            {(sessions.data || []) //preventing undefined exceptions
              .filter(s => s.hallId == 1)
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
            {(sessions.data || []) //preventing undefined exceptions
              .filter(s => s.hallId == 2)
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