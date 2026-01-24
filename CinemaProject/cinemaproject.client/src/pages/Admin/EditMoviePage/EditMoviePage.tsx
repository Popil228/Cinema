import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';
import type { Actor, StrictMovieInfo } from '../../../types/movie';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';

const EditMoviePage: React.FC = () => {
  //const { id } = useParams();
  //const location = useLocation();
  //const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const movieEditContext = useContext(MoveEditContext);
  const movie = movieEditContext.movieInfo;

  // Стан для редагування актора
  const [editingActorIndex, setEditingActorIndex] = useState<number | null>(null);
  const [tempActorData, setTempActorData] = useState<Actor>({ name: '', photoUri: '', role: '' } as Actor);

  useEffect(() => {
    if(!movieEditContext.isLoaded)
    {
      const stored_text = localStorage.getItem("movie_edit")
      if(stored_text===null)
      {
        //new blank page case
        //throw new Error("no movie data available");
      }
      else
      {
        const parsedObj:StrictMovieInfo = JSON.parse(stored_text) as StrictMovieInfo;
        movieEditContext.setMovieInfo({...parsedObj});
        movieEditContext.setIsLoaded(true);
      }
    }
    else{
      localStorage.setItem("movie_edit",JSON.stringify(movieEditContext.movieInfo))
    }
  },[])

  // useEffect(() => {
  //   if (location.state?.baseData) {
  //     const { title, posterUrl, year } = location.state.baseData;
  //     setMovie(prev => ({
  //       ...prev,
  //       title,
  //       posterUrl,
  //       year,
  //       duration: '2г 15хв',
  //       description: 'Опис фільму, який ми автоматично отримали з бази даних пошуку...',
  //       genres: ['Фантастика', 'Бойовик'],
  //       actors: [
  //         { name: 'Джек Блек', portrait: '/actors/black.jpg', role: 'Стів' },
  //         { name: 'Джейсон Момоа', portrait: '/actors/momoa.jpg', role: 'Гаррет' }
  //       ]
  //     }));
  //   } else if (isEditMode) {
  //     setMovie({
  //       id: Number(id),
  //       title: 'Minecraft',
  //       duration: '2г 30хв',
  //       genres: ['Фантастика', 'Пригоди'],
  //       actors: [
  //         { name: 'Емма Майєрс', portrait: '/actors/emma.jpg', role: 'Наталі' },
  //         { name: 'Роберт Дауні-молодший', portrait: '/actors/robert.jpg', role: 'Алекс' }
  //       ],
  //       description: 'Сюжет про світ блоків...',
  //       posterUrl: '/Minecraft.png'
  //     });
  //   }
  // }, [id, isEditMode, location.state]);

  // Функції для редагування актора
  const handleStartEditActor = (index: number, actor: Actor) => {
    setEditingActorIndex(index);
    setTempActorData(actor);
  };

  const handleSaveActor = (index: number) => {
    if (!movie.extraInfo.actors) return;
    const updatedActors = [...movie.extraInfo.actors];
    updatedActors[index] = tempActorData;
    movieEditContext.setMovieInfo({...movie,
      extraInfo:{...(movie.extraInfo),
        actors: updatedActors,
      }
    })
    setEditingActorIndex(null);
    localStorage.setItem("movie_edit",JSON.stringify(movieEditContext.movieInfo))
  };

  const handleConfirm = () => {
    localStorage.removeItem("movie_edit");
    console.log('Final Movie Data:', movie);
    navigate('/admin/movies');
  }
  
  const handleCancel = () => {
    localStorage.removeItem("movie_edit");
    navigate('/admin/movies/search')
  }

  if(!movieEditContext.isLoaded)
  {
    return (<h2 className={styles.noMovieInfoMsg}>Відсутні дані про фільм</h2>)
  }

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.posterBlock}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`} alt="Poster" />
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.fieldGroup}>
            <label>Назва</label>
            <p className={styles.staticValue}>{movie.mainInfo.title}</p>
          </div>

          <div className={styles.fieldGroup}>
            <label>Жанри</label>
            <div className={styles.tagCloud}>
              {movie.extraInfo?.genres?.map(genre => (
                <span key={genre.id} className={styles.tag}>
                  {genre.name}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість</label>
            <p className={styles.staticValue}>{movie.extraInfo.runtime} хв</p>
          </div>

          <button className={styles.sessionsBtn}>Редагувати Сеанси ✎</button>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.fieldGroup}>
          <label>Актори</label>
          <div className={styles.actorsGrid}>
            {movie.extraInfo.actors?.map((actor, index) => (
              <div key={actor.name} className={styles.actorCard}>
                <img src={`https://image.tmdb.org/t/p/w500${actor.photoUri}`} alt={actor.name} className={styles.actorPhoto} />
                
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
            value={movie.extraInfo.overview} 
            onChange={(e) => {movieEditContext.setMovieInfo(
              {...movie, 
                extraInfo:{
                  ...(movie.extraInfo), 
                  overview: e.target.value
                }
              })}}
            rows={6}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={handleCancel}>
          Скасувати
        </button>
        <button 
          className={styles.saveBtn} 
          onClick={handleConfirm}>
          ✓
        </button>
      </div>
    </div>
  );
};

export default EditMoviePage;