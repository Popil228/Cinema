import React, { useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ActorCard from './pageComponents/ActorCard';
import styles from './MoviePage.module.scss';
import type { Movie, Session } from '../../types/movie';
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';

const MoviePage: React.FC = () => {
  const { id } = useParams();
  id; // для майбутнього використання
  const carouselRef = useRef<HTMLDivElement>(null);

  const movie: Movie = {
    id: 1,
    title: 'Minecraft',
    posterUrl: '/Minecraft.png',
    genres: ['Фантастика', 'Пригоди'],
    duration: '2г 30хв',
    year: 2024,
    description: 'Сюжет розповідає про групу чотирьох аутсайдерів (Гаррет, Генрі, Наталі та Дон), які через таємничий портал потрапляють у дивовижний кубічний світ Верхнього світу. Щоб повернутися додому, їм доведеться не лише опанувати майстерність крафту, а й захистити цей світ від піглінів та зомбі разом із досвідченим майстром-будівельником Стівом.',
    actors: [
      {id: 1, name: 'Джек Блек', photoUri: '/actors/black.jpg', role: 'Стів' },
      {id: 2, name: 'Джейсон Момоа', photoUri: '/actors/momoa.jpg', role: 'Гаррет' },
      {id: 3, name: 'Емма Майєрс', photoUri: '/actors/emma.jpg', role: 'Наталі' },
      {id: 4, name: 'Даніель Брукс', photoUri: '/actors/brooks.jpg', role: 'Дон' },
      {id: 5, name: 'Себастьян Юджин Гансен', photoUri: '/actors/henry.jpg', role: 'Генрі' },
      {id: 6, name: 'Роберт Дауні-молодший', photoUri: '/actors/robert.jpg', role: 'Алекс' },
      {id: 7, name: 'Ірфан Хан', photoUri: '/actors/irfan.jpg', role: 'Оракул' },
    ]
  };

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
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.mainInfo}>
        <div className={styles.contentContainer}>
          <div className={styles.posterSide}>
            <img src={movie.posterUrl} alt={movie.title} className={styles.mainPoster} />
          </div>

          <div className={styles.detailsSide}>
            <h1 className={styles.movieTitle}>{movie.title}</h1>
            <p className={styles.metaInfo}>
              {movie.genres?.join(', ')} | {movie.duration} | {movie.year}
            </p>

            <div className={styles.actorsBlock}>
              <h2 className={styles.subTitle}>Актори</h2>
              <div className={styles.actorsCarousel} ref={carouselRef}>
                {movie.actors?.map((actor, index) => (
                  <ActorCard key={index} {...actor} />
                ))}
              </div>
            </div>

            <button className={styles.buyBtn}>Забронювати місце</button>

            <div className={styles.descriptionBlock}>
              <h2 className={styles.subTitle}>Опис</h2>
              <p className={styles.descriptionText}>{movie.description}</p>
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