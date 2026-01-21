import React, { useState } from 'react';
//import { useParams, useNavigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';

const EditMoviePage: React.FC = () => {
  //const { id } = useParams();
  const navigate = useNavigate();

  // Імітація початкових даних (потім буде завантажуватися по ID)
  const [movie, setMovie] = useState({
    title: 'Minecraft',
    duration: '2г 30хв',
    genres: ['Фантастика', 'Пригоди'],
    actors: ['Джек Блек', 'Джейсон Момоа', 'Емма Майєрс', 'Даніель Брукс', 'Себастьян Юджин Гансен', 'Дженніфер Кулідж', 'Кейт Маккіннон', 'Джемейн Клемент'],
    description: 'Сюжет розповідає про групу чотирьох аутсайдерів...',
    posterUrl: '/Minecraft.png'
  });

  // Стан для керування полями введення
  const [newGenre, setNewGenre] = useState('');
  const [showGenreInput, setShowGenreInput] = useState(false);
  
  const [newActor, setNewActor] = useState('');
  const [showActorInput, setShowActorInput] = useState(false);

  // Функції додавання
  const addGenre = () => {
    if (newGenre.trim()) {
      setMovie({ ...movie, genres: [...movie.genres, newGenre.trim()] });
      setNewGenre('');
    }
    setShowGenreInput(false);
  };

  const addActor = () => {
    if (newActor.trim()) {
      setMovie({ ...movie, actors: [...movie.actors, newActor.trim()] });
      setNewActor('');
    }
    setShowActorInput(false);
  };

  const handleRemoveGenre = (genreToRemove: string) => {
    setMovie({ ...movie, genres: movie.genres.filter(g => g !== genreToRemove) });
  };

  const handleRemoveActor = (actorToRemove: string) => {
    setMovie({ ...movie, actors: movie.actors.filter(a => a !== actorToRemove) });
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.posterBlock}>
          <img src={movie.posterUrl} alt="Poster" />
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.fieldGroup}>
            <label>Назва</label>
            <input 
              type="text" 
              value={movie.title} 
              onChange={(e) => setMovie({...movie, title: e.target.value})}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Жанри</label>
            <div className={styles.tagCloud}>
              {movie.genres.map(genre => (
                <span key={genre} className={styles.tag}>
                  {genre} <button onClick={() => handleRemoveGenre(genre)}>✕</button>
                </span>
              ))}
              
              {/* Логіка додавання жанру */}
              {showGenreInput ? (
                <input 
                  autoFocus
                  className={styles.miniInput}
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onBlur={addGenre}
                  onKeyDown={(e) => e.key === 'Enter' && addGenre()}
                />
              ) : (
                <button className={styles.addTagBtn} onClick={() => setShowGenreInput(true)}>+</button>
              )}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість</label>
            <input 
              type="text" 
              value={movie.duration} 
              onChange={(e) => setMovie({...movie, duration: e.target.value})}
            />
          </div>

          <button className={styles.sessionsBtn}>Редагувати Сеанси ✎</button>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.fieldGroup}>
          <label>Актори</label>
          <div className={styles.tagCloud}>
            {movie.actors.map(actor => (
              <span key={actor} className={styles.tag}>
                {actor} <button onClick={() => handleRemoveActor(actor)}>✕</button>
              </span>
            ))}
            
            {/* Логіка додавання актора */}
            {showActorInput ? (
              <input 
                autoFocus
                className={styles.miniInput}
                value={newActor}
                onChange={(e) => setNewActor(e.target.value)}
                onBlur={addActor}
                onKeyDown={(e) => e.key === 'Enter' && addActor()}
              />
            ) : (
              <button className={styles.addTagBtn} onClick={() => setShowActorInput(true)}>+</button>
            )}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Опис</label>
          <textarea 
            value={movie.description} 
            onChange={(e) => setMovie({...movie, description: e.target.value})}
            rows={5}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.cancelBtn} 
          onClick={() => navigate('/admin/movies')}
        >
          Скасувати
        </button>

        <button 
          className={styles.saveBtn} 
          onClick={() => {
            console.log('Saved:', movie);
            navigate('/admin/movies');
          }}
        >
          ✓
        </button>
      </div>
    </div>
  );
};

export default EditMoviePage;