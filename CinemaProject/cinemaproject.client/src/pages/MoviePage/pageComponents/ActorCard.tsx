import React from 'react';
import type { Cast } from '../../../types/movie';
import styles from './ActorCard.module.scss';

const ActorCard: React.FC<Cast> = ({ name, photoUri, character }) => {
  return (
    <div className={styles.actorCard}>
      <div className={styles.portraitWrapper}>
        <img src={photoUri} alt={name} className={styles.portrait} />
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.role}>{character}</p>
      </div>
    </div>
  );
};

export default ActorCard;