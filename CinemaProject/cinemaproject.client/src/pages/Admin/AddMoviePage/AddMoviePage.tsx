import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../EditMoviePage/EditMoviePage.module.scss';
import type { Cast, StrictMovieInfo, Genre } from '../../../types/movie';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';
import * as movieApi from '../../../api/movieApi';

const AddMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  const movie = movieEditContext.movieInfo;

  const [availableGenres] = useState<Genre[]>([
    { id: 28, name: 'Бойовик' },
    { id: 12, name: 'Пригоди' },
    { id: 16, name: 'Мультфільм' },
    { id: 35, name: 'Комедія' },
    { id: 80, name: 'Кримінал' },
    { id: 18, name: 'Драма' },
    { id: 14, name: 'Фентезі' },
    { id: 27, name: 'Жахи' },
    { id: 878, name: 'Фантастика' },
  ]);

  const [editingActorIndex, setEditingActorIndex] = useState<number | null>(null);
  const [tempActorData, setTempActorData] = useState<Cast>({ name: '', photoUri: '', character: '' } as Cast);

  useEffect(() => {
    if (!movieEditContext.isLoaded) {
      const stored_text = localStorage.getItem("movie_add_temp");
      if (stored_text) {
        const parsedObj = JSON.parse(stored_text) as StrictMovieInfo;
        movieEditContext.setMovieInfo({ ...parsedObj });
        movieEditContext.setIsLoaded(true);
      }
    } else {
      localStorage.setItem("movie_add_temp", JSON.stringify(movieEditContext.movieInfo));
    }
  }, [movieEditContext.movieInfo]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({
      ...movie,
      mainInfo: { ...movie.mainInfo, title: e.target.value }
    });
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: { ...movie.extraInfo, runtime: Number(e.target.value) }
    });
  };

  // Логіка Жанрів
  const handleAddGenre = (genreId: string) => {
    const selectedGenre = availableGenres.find(g => g.id === Number(genreId));
    if (selectedGenre && !movie.extraInfo.genres.some(g => g.id === selectedGenre.id)) {
      movieEditContext.setMovieInfo({
        ...movie,
        extraInfo: { ...movie.extraInfo, genres: [...movie.extraInfo.genres, selectedGenre] }
      });
    }
  };

  const handleRemoveGenre = (id: number) => {
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: {
        ...movie.extraInfo,
        genres: movie.extraInfo.genres.filter(g => g.id !== id)
      }
    });
  };

  const handleStartEditActor = (index: number, actor: Cast) => {
    setEditingActorIndex(index);
    setTempActorData(actor);
  };

  const handleSaveActor = (index: number) => {
    const updatedActors = [...movie.extraInfo.actors];
    updatedActors[index] = tempActorData;
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: { ...movie.extraInfo, actors: updatedActors }
    });
    setEditingActorIndex(null);
  };

  const handleConfirm = async () => {
    try {
      await movieApi.createMovie(movie);
      localStorage.removeItem("movie_add_temp");
      alert("Фільм успішно створено!");
      navigate('/admin/movies');
    } catch (err) {
      console.error(err);
      alert("Помилка при створенні фільму");
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("movie_add_temp");
    navigate('/admin/movies/search');
  };

  if (!movieEditContext.isLoaded) {
    return <h2 className={styles.noMovieInfoMsg}>Завантаження даних фільму...</h2>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.posterBlock}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`} alt="Poster" />
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.fieldGroup}>
            <label>Назва фільму</label>
            <input 
              className={styles.editInput} 
              value={movie.mainInfo.title} 
              onChange={handleTitleChange} 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Жанри</label>
            <div className={styles.tagCloud}>
              {movie.extraInfo.genres.map(genre => (
                <span key={genre.id} className={styles.tag}>
                  {genre.name}
                  <button type="button" onClick={() => handleRemoveGenre(genre.id)} className={styles.removeTagBtn}>×</button>
                </span>
              ))}
              <select 
                className={styles.genreSelect} 
                onChange={(e) => handleAddGenre(e.target.value)}
                value=""
              >
                <option value="" disabled hidden>+ Додати жанр</option>
                {availableGenres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість (хв)</label>
            <input 
              type="number"
              className={styles.editInput} 
              value={movie.extraInfo.runtime} 
              onChange={handleRuntimeChange} 
            />
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.fieldGroup}>
          <label>Актори</label>
          <div className={styles.actorsGrid}>
            {movie.extraInfo.actors?.map((actor, index) => (
              <div key={index} className={styles.actorCard}>
                <img src={`https://image.tmdb.org/t/p/w500${actor.photoUri}`} alt={actor.name} className={styles.actorPhoto} />
                <div className={styles.actorText}>
                  {editingActorIndex === index ? (
                    <div className={styles.actorEditInputs}>
                      <input 
                        value={tempActorData.name} 
                        onChange={(e) => setTempActorData({...tempActorData, name: e.target.value})}
                      />
                      <input 
                        value={tempActorData.character} 
                        onChange={(e) => setTempActorData({...tempActorData, character: e.target.value})}
                      />
                    </div>
                  ) : (
                    <>
                      <p className={styles.actorName}>{actor.name}</p>
                      <p className={styles.actorRole}>{actor.character}</p>
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
            onChange={(e) => movieEditContext.setMovieInfo({
              ...movie, 
              extraInfo: { ...movie.extraInfo, overview: e.target.value }
            })}
            rows={6}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.cancelBtn} onClick={handleCancel}>Скасувати</button>
        <button className={styles.saveBtn} onClick={handleConfirm}>✓</button>
      </div>
    </div>
  );
};

export default AddMoviePage;