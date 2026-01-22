import React, { useState } from 'react';
import AdminSessionCard from '../../../components/Admin/AdminSessionCard/AdminSessionCard.tsx';
import styles from './AdminSessionsPage.module.scss';
import type { Session } from '../../../types/movie';

const AdminSessionsPage: React.FC = () => {
  const [filterMovie, setFilterMovie] = useState('all');

  const allSessions: Session[] = [
    { id: 1, title: 'Minecraft', hall: 'A', date: '3 квітня', time: '13:00', imageUrl: '/Minecraft.png', genres: ['Фантастика'] },
    { id: 2, title: 'Minecraft', hall: 'B', date: '3 квітня', time: '15:00', imageUrl: '/Minecraft.png', genres: ['Фантастика'] },
    { id: 3, title: 'Avatar', hall: 'A', date: '4 квітня', time: '18:00', imageUrl: '/Avatar.png', genres: ['Екшн'] },
    { id: 4, title: 'Avatar', hall: 'B', date: '4 квітня', time: '20:00', imageUrl: '/Avatar.png', genres: ['Екшн'] },
    { id: 5, title: 'Minecraft', hall: 'A', date: '5 квітня', time: '10:00', imageUrl: '/Minecraft.png', genres: ['Фантастика'] },
  ];

  const movieTitles = Array.from(new Set(allSessions.map(s => s.title)));

  const filteredSessions = filterMovie === 'all' 
    ? allSessions 
    : allSessions.filter(session => session.title === filterMovie);

  const sessionsHallA = filteredSessions.filter(s => s.hall === 'A');
  const sessionsHallB = filteredSessions.filter(s => s.hall === 'B');

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Сеанси</h1>
          <select 
            className={styles.movieSelect}
            value={filterMovie}
            onChange={(e) => setFilterMovie(e.target.value)}
          >
            <option value="all">Всі фільми</option>
            {movieTitles.map(title => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
        <button className={styles.addBtn}>+</button>
      </header>

      <div className={styles.hallsGrid}>
        <section className={styles.hallColumn}>
          <h2 className={styles.hallTitle}>ЗАЛ А</h2>
          {sessionsHallA.length > 0 ? (
            sessionsHallA.map(session => <AdminSessionCard key={session.id} {...session} />)
          ) : (
            <p className={styles.noSessions}>Немає сеансів</p>
          )}
        </section>

        <section className={styles.hallColumn}>
          <h2 className={styles.hallTitle}>ЗАЛ В</h2>
          {sessionsHallB.length > 0 ? (
            sessionsHallB.map(session => <AdminSessionCard key={session.id} {...session} />)
          ) : (
            <p className={styles.noSessions}>Немає сеансів</p>
          )}
        </section>
      </div>

      <hr className={styles.divider} />

      <section className={styles.archive}>
        <h2 className={styles.sectionTitle}>Архів</h2>
        <div className={styles.hallsGrid}>
          <div className={styles.hallColumn}>
             {filteredSessions.slice(0, 1).map(s => <AdminSessionCard key={`arch-${s.id}`} {...s} />)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSessionsPage;