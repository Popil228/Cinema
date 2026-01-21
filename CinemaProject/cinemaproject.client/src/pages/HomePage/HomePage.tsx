import React from 'react';
import MovieCard from '../../components/MovieCard/MovieCard';
import SessionItem from '../../components/SessionItem/SessionItem';
import styles from './HomePage.module.scss';
import type { Movie, Session } from '../../types/movie';

const Home: React.FC = () => {
  const movies: Movie[] = [
    { id: 1, title: 'Скажене весілля', posterUrl: '/movies/wedding.png', releaseDate: '01/01 - 01/02' },
    { id: 2, title: 'Minecraft: Movie', posterUrl: '/Minecraft.png', releaseDate: '10/02 - 25/02' },
    { id: 3, title: 'Дюна: Частина друга', posterUrl: '/movies/dune.png', releaseDate: '15/02 - 01/03' },
    { id: 4, title: 'Вонка', posterUrl: '/movies/wonka.png', releaseDate: '20/02 - 10/03' },
    { id: 5, title: 'Аквамен 2', posterUrl: '/movies/aquaman.png', releaseDate: '01/03 - 20/03' },
    { id: 6, title: 'Кунг-фу Панда 4', posterUrl: '/movies/panda.png', releaseDate: '05/03 - 30/03' },
  ];

  const sessions: Session[] = [
    {
      id: 1,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: "3 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 2,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "3 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 3,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "3 квітня",
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    }
  ];
  
  return (
    <>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>В прокаті</h2>
        <div className={styles.movieGrid}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
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
                  key={session.id}
                  title={session.title}
                  genres={session.genres}
                  date={session.date}
                  time={session.time}
                  imageUrl={session.imageUrl}

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
                  key={session.id}
                  title={session.title}
                  genres={session.genres}
                  date={session.date}
                  time={session.time}
                  imageUrl={session.imageUrl}
                  
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