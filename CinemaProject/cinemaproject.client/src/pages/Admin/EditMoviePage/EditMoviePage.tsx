import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';
import type { Movie } from '../../../types/movie';

const EditMoviePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);

  // Ініціалізація стану згідно з інтерфейсом Movie
  const [movie, setMovie] = useState<Partial<Movie>>({
    title: '',
    duration: '',
    genres: [],
    actors: [],
    description: '',
    posterUrl: '/placeholder-poster.png',
    year: new Date().getFullYear()
  });

  // Логіка для нових тегів (жанри)
  const [newGenre, setNewGenre] = useState('');
  const [showGenreInput, setShowGenreInput] = useState(false);

  useEffect(() => {
    // 1. Якщо ми прийшли зі сторінки пошуку (створюємо новий фільм)
    if (location.state?.baseData) {
      const { title, posterUrl, year } = location.state.baseData;
      
      setMovie(prev => ({
        ...prev,
        title,
        posterUrl,
        year,
        // Імітуємо підтягування решти даних (опис, актори) після вибору фільму
        duration: '2г 15хв',
        description: 'Опис фільму, який ми автоматично отримали з бази даних пошуку...',
        genres: ['Фантастика', 'Бойовик'],
        actors: [
          { name: 'Джек Блек', portrait: '/actors/black.jpg', role: 'Стів' },
          { name: 'Джейсон Момоа', portrait: '/actors/momoa.jpg', role: 'Гаррет' }
        ]
      }));
    } 
    // 2. Якщо ми просто редагуємо існуючий фільм по ID
    else if (isEditMode) {
      // Тут буде реальний fetch(id)
      setMovie({
        id: Number(id),
        title: 'Minecraft',
        duration: '2г 30хв',
        genres: ['Фантастика', 'Пригоди'],
        actors: [
          { name: 'Емма Майєрс', portrait: '/actors/emma.jpg', role: 'Наталі' }
        ],
        description: 'Сюжет про світ блоків...',
        posterUrl: '/Minecraft.png'
      });
    }
  }, [id, isEditMode, location.state]);

  const addGenre = () => {
    if (newGenre.trim()) {
      setMovie(prev => ({ ...prev, genres: [...(prev.genres || []), newGenre.trim()] }));
      setNewGenre('');
    }
    setShowGenreInput(false);
  };

  const removeGenre = (genreToRemove: string) => {
    setMovie(prev => ({ ...prev, genres: prev.genres?.filter(g => g !== genreToRemove) }));
  };

  const removeActor = (actorName: string) => {
    setMovie(prev => ({ ...prev, actors: prev.actors?.filter(a => a.name !== actorName) }));
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
              {movie.genres?.map(genre => (
                <span key={genre} className={styles.tag}>
                  {genre} <button onClick={() => removeGenre(genre)}>✕</button>
                </span>
              ))}
              
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
          <div className={styles.actorsGrid}>
            {movie.actors?.map(actor => (
              <div key={actor.name} className={styles.actorCard}>
                <img src={actor.portrait} alt={actor.name} className={styles.actorPhoto} />
                <div className={styles.actorText}>
                  <p className={styles.actorName}>{actor.name}</p>
                  <p className={styles.actorRole}>{actor.role}</p>
                </div>
                <button className={styles.removeActor} onClick={() => removeActor(actor.name)}>✕</button>
              </div>
            ))}
            <button className={styles.addActorBtn}>+</button>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Опис</label>
          <textarea 
            value={movie.description} 
            onChange={(e) => setMovie({...movie, description: e.target.value})}
            rows={6}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={() => navigate('/admin/movies')}>
          Скасувати
        </button>
        <button 
          className={styles.saveBtn} 
          onClick={() => {
            console.log('Final Movie Data:', movie);
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