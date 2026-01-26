import React, { useContext, useEffect, useState } from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import SessionItem from '../../components/SessionItem/SessionItem';
import styles from './HomePage.module.scss';
import { type Session } from '../../types/movie';
import { getAllRollingMovies } from '../../api/moviesApi';
import UserMoviesContext from '../../context/userMoviesContext/UserMoviesContext';

const Home: React.FC = () => {
  const rollingMovies = useContext(UserMoviesContext);
  const [rollingMoviesError,setRollingMoviesError] = useState<{is: boolean, text: string}>({is:true, text:"Завантаження..."});

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
    }

    fetchData();
  },[])

  const sessions: Session[] = [
    {
      id: 1,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: new Date("2025-04-03"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 2,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-03"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 3,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-03"),
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    }
  ];
  
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В прокаті</h2>
        { rollingMoviesError.is ? 
        <h2 className={styles.sectionTitle}>{rollingMoviesError.text}</h2> :
        <div className={styles.movieGrid}>
          {rollingMovies.movies.map(movie => (
            <MovieCard key={movie.mainInfo.id} movie={movie} />
          ))}
        </div>
        }
      </section>

      <section className={styles.section}>
        <h2 className={styles.centeredTitle}>Найближчі сеанси</h2>
        
        <div className={styles.sessionsWrapper}>
          <div className={styles.hallColumn}>
            <h3>Зал А</h3>
            {sessions
              .filter(s => s.hall === 'A')
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
              .filter(s => s.hall === 'B')
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
    </>
  );
};

export default Home;