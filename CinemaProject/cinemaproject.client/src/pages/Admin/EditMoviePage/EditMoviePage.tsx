import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';
import type { Cast, StrictMovieInfo, Genre, MovieSummary } from '../../../types/movie';
import type { MovieActor } from '../../../types/movieActor';
import type { MovieGenre } from '../../../types/movieGenre';
import type { Actor } from '../../../types/actor';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';

// Імпорти всіх необхідних API
import * as movieApi from '../../../api/moviesApi';
import * as actorApi from '../../../api/actorApi';
import * as movieActorApi from '../../../api/movieActorApi';
import * as movieGenreApi from '../../../api/movieGenreApi';
import * as genresApi from '../../../api/genresApi';

const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  const movie = movieEditContext.movieInfo;

  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [editingActorIndex, setEditingActorIndex] = useState<number | null>(null);
  const [tempActorData, setTempActorData] = useState<Cast>({ name: '', photoUri: '', role: '' } as Cast);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await genresApi.getAllGenres();
        const normalized = genres.map((g: any) => ({
          id: Number(g.id || g.genreId),
          name: g.name
        }));
        setAvailableGenres(normalized);
      } catch (err) {
        console.error("Помилка завантаження жанрів:", err);
      }
    };
    fetchGenres();
  }, []);

  // Завантаження даних фільму з Context/LocalStorage
  useEffect(() => {
    const loadMovie = async () => {
      if (!movieEditContext.isLoaded && id) {
        try {
          const stored_text = localStorage.getItem("movie_edit");
          if (stored_text) {
            const parsedObj = JSON.parse(stored_text) as StrictMovieInfo;
            movieEditContext.setMovieInfo({ ...parsedObj });
            movieEditContext.setIsLoaded(true);
          }
        } catch (err) {
          console.error("Помилка завантаження фільму", err);
        }
      }
    };
    loadMovie();
  }, [id, movieEditContext]);

  // Збереження в локальне сховище при змінах
  useEffect(() => {
    if (movieEditContext.isLoaded) {
      localStorage.setItem("movie_edit", JSON.stringify(movieEditContext.movieInfo));
    }
  }, [movieEditContext.movieInfo, movieEditContext.isLoaded]);

  // Хендлери змін
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, mainInfo: { ...movie.mainInfo, title: e.target.value } });
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, runtime: Number(e.target.value) } });
  };

  const handleAddGenre = (genreId: string) => {
    const idToFind = Number(genreId);
    const selectedGenre = availableGenres.find(g => g.id === idToFind);
    if (selectedGenre) {
      const currentGenres = movie.extraInfo.genres || [];
      const exists = currentGenres.some(g => Number(g.id || (g as any).genreId) === selectedGenre.id);
      if (!exists) {
        movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, genres: [...currentGenres, selectedGenre] } });
      }
    }
  };

  const handleRemoveGenre = (id: number) => {
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, genres: movie.extraInfo.genres.filter(g => Number(g.id || (g as any).genreId) !== id) } });
  };

  const handleStartEditActor = (index: number, actor: Cast) => {
    setEditingActorIndex(index);
    setTempActorData(actor);
  };

  const handleSaveActor = (index: number) => {
    const updatedActors = [...movie.extraInfo.actors];
    updatedActors[index] = tempActorData;
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, actors: updatedActors } });
    setEditingActorIndex(null);
  };

  // --- ГОЛОВНА ЛОГІКА ОНОВЛЕННЯ ---
  const handleConfirm = async () => {
    const movieId = Number(id);

    try {
      const movieSummary: MovieSummary = {
        id: movieId,
        title: movie.mainInfo.title,
        releaseDate: movie.mainInfo.releaseDate,
        posterPath: movie.mainInfo.posterPath,
        runtime: movie.extraInfo.runtime,
        overview: movie.extraInfo.overview
      };
      await movieApi.updateMovie(movieSummary);

      if (movie.extraInfo.actors.length > 0) {
        const actorsData: Actor[] = movie.extraInfo.actors.map(a => ({
          id: a.id,
          name: a.name,
          photoUri: a.photoUri
        }));
        await actorApi.updateActor(actorsData);

        // Оновлення зв'язків Movie + Actor
        const movieActors: MovieActor[] = movie.extraInfo.actors.map(a => ({
          movieId: movieId,
          actorId: a.id,
          character: a.role || "Не вказано"
        }));
        await movieActorApi.updateMovieActor(movieActors);
      }

      // Оновлення зв'язків Movie + Genre
      if (movie.extraInfo.genres.length > 0) {
        const movieGenres: MovieGenre[] = movie.extraInfo.genres.map(g => ({
          movieId: movieId,
          genreId: Number(g.id || (g as any).genreId)
        }));
        await movieGenreApi.updateMovieGenre(movieGenres);
      }

      localStorage.removeItem("movie_edit");
      alert("Дані фільму успішно оновлено!");
      navigate('/admin/movies');

    } catch (err) {
      console.error("Помилка при оновленні фільму:", err);
      alert(`Помилка: ${err instanceof Error ? err.message : "Невідома помилка"}`);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("movie_edit");
    navigate('/admin/movies');
  };

  if (!movieEditContext.isLoaded) {
    return <h2 className={styles.noMovieInfoMsg}>Завантаження даних...</h2>;
  }

  const filteredGenresForSelect = availableGenres.filter(ag => 
    !movie.extraInfo.genres.some(mg => Number(mg.id || (mg as any).genreId) === ag.id)
  );

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.posterBlock}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`} alt="Poster" />
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.fieldGroup}>
            <label>Назва (Редагування)</label>
            <input className={styles.editInput} value={movie.mainInfo.title} onChange={handleTitleChange} />
          </div>

          <div className={styles.fieldGroup}>
            <label>Жанри</label>
            <div className={styles.tagCloud}>
              {movie.extraInfo.genres.map(genre => {
                const gId = Number(genre.id || (genre as any).genreId);
                return (
                  <span key={gId} className={styles.tag}>
                    {genre.name}
                    <button type="button" onClick={() => handleRemoveGenre(gId)} className={styles.removeTagBtn}>×</button>
                  </span>
                );
              })}
              <select 
                className={styles.genreSelect} 
                onChange={(e) => { handleAddGenre(e.target.value); e.target.value = ""; }}
                value=""
              >
                <option value="" disabled hidden>+ Додати</option>
                {filteredGenresForSelect.map(g => (
                  <option key={g.id} value={g.id.toString()}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість (хв)</label>
            <input type="number" className={styles.editInput} value={movie.extraInfo.runtime} onChange={handleRuntimeChange} />
          </div>

          <button className={styles.sessionsBtn}>Редагувати Сеанси ✎</button>
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
                      <input value={tempActorData.name} onChange={(e) => setTempActorData({...tempActorData, name: e.target.value})} />
                      <input value={tempActorData.role} onChange={(e) => setTempActorData({...tempActorData, role: e.target.value})} />
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
            onChange={(e) => movieEditContext.setMovieInfo({...movie, extraInfo: { ...movie.extraInfo, overview: e.target.value }})}
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

export default EditMoviePage;