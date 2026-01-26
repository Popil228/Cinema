import React from 'react';
import type { Cast } from '../../../types/movie';
import styles from './ActorCard.module.scss';

const ActorCard: React.FC<{actor:Cast}> = ({ actor }) => {
  const photoLink = `https://image.tmdb.org/t/p/w500${actor.photoUri}`;

  return (
    <div className={styles.actorCard}>
      <div className={styles.portraitWrapper}>
        <img src={photoLink} alt={actor.name} className={styles.portrait} />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{actor.name}</p>
        <p className={styles.role}>{actor.role}</p>
      </div>
    </div>
  );
};

export default ActorCard;