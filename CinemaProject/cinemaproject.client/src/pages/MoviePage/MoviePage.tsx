import React from 'react';
import { useParams } from 'react-router-dom';
import styles from './MoviePage.module.scss';
import type { Movie } from '../../types/movie';

const MoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Тимчасовий масив фільмів для демонстрації (у реальному додатку дані можуть надходити з API)
  const movies: Movie[] = [
    { id: 1, title: 'Скажене весілля', posterUrl: '/movies/wedding.png', releaseDate: '01/01 - 01/02' },
    { id: 2, title: 'Minecraft: Movie', posterUrl: '/movies/minecraft.png', releaseDate: '10/02 - 25/02' },
    { id: 3, title: 'Дюна: Частина друга', posterUrl: '/movies/dune.png', releaseDate: '15/02 - 01/03' },
    { id: 4, title: 'Вонка', posterUrl: '/movies/wonka.png', releaseDate: '20/02 - 10/03' },
    { id: 5, title: 'Аквамен 2', posterUrl: '/movies/aquaman.png', releaseDate: '01/03 - 20/03' },
    { id: 6, title: 'Кунг-фу Панда 4', posterUrl: '/movies/panda.png', releaseDate: '05/03 - 30/03' },
  ];

  const movie = movies.find(m => m.id === Number(id));

  if (!movie) {
    return (
      <div className={styles.container}>
        <h1>Фільм не знайдено</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.movieContent}>
        
        <div className={styles.infoSide}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.releaseDate}>В прокаті: {movie.releaseDate}</p>
          
          <div className={styles.description}>
            <p>
              Тут згодом з'явиться детальний опис фільму "{movie.title}". 
              Це динамічна сторінка, яка отримує дані на основі ID: {id}.
            </p>
          </div>

          <button className={styles.buyTicketBtn}>Придбати квиток</button>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;