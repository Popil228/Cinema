import React, { useState } from 'react';
import styles from '../AdminActorCard/AdminActorCard.module.scss'; // Використовуємо ті ж стилі або винесіть в окремі
import type { Cast } from '../../../types/movie';

interface ActorCardProps {
  actor: Cast;
  onSave: (updatedActor: Cast) => void;
}

const ActorCard: React.FC<ActorCardProps> = ({ actor, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<Cast>({ ...actor });

  const handleSave = () => {
    onSave(tempData);
    setIsEditing(false);
  };

  return (
    <div className={styles.actorCard}>
      <img 
        src={`https://image.tmdb.org/t/p/w500${actor.photoUri}`} 
        alt={actor.name} 
        className={styles.actorPhoto} 
      />
      <div className={styles.actorText}>
        {isEditing ? (
          <div className={styles.actorEditInputs}>
            <input 
              value={tempData.name} 
              onChange={(e) => setTempData({ ...tempData, name: e.target.value })} 
            />
            <input 
              value={tempData.role} 
              onChange={(e) => setTempData({ ...tempData, role: e.target.value })} 
            />
          </div>
        ) : (
          <>
            <p className={styles.actorName}>{actor.name}</p>
            <p className={styles.actorRole}>{actor.role}</p>
          </>
        )}
      </div>
      {isEditing ? (
        <button className={styles.saveActorBtn} onClick={handleSave}>✓</button>
      ) : (
        <button className={styles.editActorBtn} onClick={() => setIsEditing(true)}>✎</button>
      )}
    </div>
  );
};

export default ActorCard;