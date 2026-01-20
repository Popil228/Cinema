import React from 'react';
import AdminSessionCard from '../../../components/Admin/AdminSessionCard/AdminSessionCard.tsx';
import styles from './AdminSessionsPage.module.scss';
import type { Session } from '../../../types/movie';

const AdminSessionsPage: React.FC = () => {
  const mockSession: Session = {
    id: 1,
    title: 'Minecraft',
    hall: 'A',           
    date: '3 квітня',
    time: '13:00',
    imageUrl: '/path-to-img.jpg',
    genres: ['Фантастика', 'Пригоди']
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Сеанси</h1>
        <button className={styles.addBtn}>+</button>
      </header>

      <div className={styles.hallsGrid}>
        <section className={styles.hallColumn}>
          <h2 className={styles.hallTitle}>ЗАЛ А</h2>
          <AdminSessionCard {...mockSession} />
          <AdminSessionCard {...mockSession} />
          <AdminSessionCard {...mockSession} />
        </section>

        <section className={styles.hallColumn}>
          <h2 className={styles.hallTitle}>ЗАЛ В</h2>
          <AdminSessionCard {...mockSession} id={2} hall="B" />
          <AdminSessionCard {...mockSession} id={3} hall="B" />
          <AdminSessionCard {...mockSession} id={4} hall="B" />
        </section>
      </div>

      <hr className={styles.divider} />

      <section className={styles.archive}>
        <h2 className={styles.sectionTitle}>Архів</h2>
        <div className={styles.hallsGrid}>
          <div className={styles.hallColumn}>
             <AdminSessionCard {...mockSession} id={5} />
          </div>
          <div className={styles.hallColumn}>
             <AdminSessionCard {...mockSession} id={6} hall="B" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminSessionsPage;