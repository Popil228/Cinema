import React from 'react';
import type { Session } from '../../../types/movie';
import styles from './AdminSessionCard.module.scss';

const AdminSessionCard: React.FC<Session> = ({ title, hall, date, time, imageUrl }) => {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.miniPoster}>
          <img src={imageUrl} alt={title} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.tags}>
            <span className={styles.tag}>ЗАЛ {hall}</span>
            <span className={styles.tag}>{date}</span>
            <span className={styles.tag}>{time}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.controls}>
        <button className={styles.deleteBtn}>✕</button>
        <button className={styles.editBtn}>✎</button>
      </div>
    </div>
  );
};

export default AdminSessionCard;