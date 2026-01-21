import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';
import type { Movie, Actor } from '../../../types/movie';

const EditMoviePage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);

  // Стан фільму
  const [movie, setMovie] = useState<Partial<Movie>>({
    title: '',
    duration: '',
    genres: [],
    actors: [],
    description: '',
    posterUrl: '/placeholder-poster.png',
    year: new Date().getFullYear()
  });

  // Стан для редагування актора
  const [editingActorIndex, setEditingActorIndex] = useState<number | null>(null);
  const [tempActorData, setTempActorData] = useState<Actor>({ name: '', portrait: '', role: '' });

  useEffect(() => {
    if (location.state?.baseData) {
      const { title, posterUrl, year } = location.state.baseData;
      setMovie(prev => ({
        ...prev,
        title,
        posterUrl,
        year,
        duration: '2г 15хв',
        description: 'Опис фільму, який ми автоматично отримали з бази даних пошуку...',
        genres: ['Фантастика', 'Бойовик'],
        actors: [
          { name: 'Джек Блек', portrait: '/actors/black.jpg', role: 'Стів' },
          { name: 'Джейсон Момоа', portrait: '/actors/momoa.jpg', role: 'Гаррет' }
        ]
      }));
    } else if (isEditMode) {
      setMovie({
        id: Number(id),
        title: 'Minecraft',
        duration: '2г 30хв',
        genres: ['Фантастика', 'Пригоди'],
        actors: [
          { name: 'Емма Майєрс', portrait: '/actors/emma.jpg', role: 'Наталі' },
          { name: 'Роберт Дауні-молодший', portrait: '/actors/robert.jpg', role: 'Алекс' }
        ],
        description: 'Сюжет про світ блоків...',
        posterUrl: '/Minecraft.png'
      });
    }
  }, [id, isEditMode, location.state]);

  // Функції для редагування актора
  const handleStartEditActor = (index: number, actor: Actor) => {
    setEditingActorIndex(index);
    setTempActorData(actor);
  };

  const handleSaveActor = (index: number) => {
    if (!movie.actors) return;
    const updatedActors = [...movie.actors];
    updatedActors[index] = tempActorData;
    setMovie({ ...movie, actors: updatedActors });
    setEditingActorIndex(null);
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
            <p className={styles.staticValue}>{movie.title}</p>
          </div>

          <div className={styles.fieldGroup}>
            <label>Жанри</label>
            <div className={styles.tagCloud}>
              {movie.genres?.map(genre => (
                <span key={genre} className={styles.tag}>
                  {genre}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість</label>
            <p className={styles.staticValue}>{movie.duration}</p>
          </div>

          <button className={styles.sessionsBtn}>Редагувати Сеанси ✎</button>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.fieldGroup}>
          <label>Актори</label>
          <div className={styles.actorsGrid}>
            {movie.actors?.map((actor, index) => (
              <div key={actor.name} className={styles.actorCard}>
                <img src={actor.portrait} alt={actor.name} className={styles.actorPhoto} />
                
                <div className={styles.actorText}>
                  {editingActorIndex === index ? (
                    <div className={styles.actorEditInputs}>
                      <input 
                        type="text" 
                        value={tempActorData.name} 
                        onChange={(e) => setTempActorData({...tempActorData, name: e.target.value})}
                        placeholder="Ім'я"
                      />
                      <input 
                        type="text" 
                        value={tempActorData.role} 
                        onChange={(e) => setTempActorData({...tempActorData, role: e.target.value})}
                        placeholder="Роль"
                      />
                    </div>
                  ) : (
                    <>
                      <p className={styles.actorName}>{actor.name}</p>
                      <p className={styles.actorRole}>{actor.role}</p>
                    </>
                  )}
                </div>

                {editingActorIndex === index ? (
                  <button className={styles.saveActorBtn} onClick={() => handleSaveActor(index)}>✓</button>
                ) : (
                  <button className={styles.editActorBtn} onClick={() => handleStartEditActor(index, actor)}>✎</button>
                )}
              </div>
            ))}
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