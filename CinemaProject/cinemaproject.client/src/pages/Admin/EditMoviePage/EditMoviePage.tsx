import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EditMoviePage.module.scss';
import type { Cast, StrictMovieInfo, Genre, MovieSummary } from '../../../types/movie';
import type { MovieActor } from '../../../types/movieActor';
import type { MovieGenre } from '../../../types/movieGenre';
import type { Actor } from '../../../types/actor';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';
import AdminActorCard from '../../../components/Admin/AdminActorCard/AdminActorCard';

import * as movieApi from '../../../api/moviesApi';
import * as actorApi from '../../../api/actorApi';
import * as movieActorApi from '../../../api/movieActorApi';
import * as movieGenreApi from '../../../api/movieGenreApi';
import * as genresApi from '../../../api/genresApi';
import * as tmdbApi from '../../../api/tmdbApi';

const EditMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  const movie = movieEditContext.movieInfo;

  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [initialActors, setInitialActors] = useState<Cast[]>([]);
  const [tmdbCast, setTmdbCast] = useState<Cast[]>([]);
  const [showActorPicker, setShowActorPicker] = useState(false);

  // Завантаження жанрів
  useEffect(() => {
    const fetchData = async () => {
      try {
        const genres = await genresApi.getAllGenres();
        setAvailableGenres(genres);

        if (movie.mainInfo.id) {
          const castData = await tmdbApi.getCastInfoByIdTMDB(movie.mainInfo.id);
          setTmdbCast(castData as Cast[]); 
        }
      } catch (err) {
        console.error("Помилка завантаження додаткових даних:", err);
      }
    };
    fetchData();
  }, [movie.mainInfo.id]);

  // Завантаження даних фільму з Context/LocalStorage
  useEffect(() => {
    const loadMovie = async () => {
      if (!movieEditContext.isLoaded && id) {
        try {
          const stored_text = localStorage.getItem("movie_edit");
          if (stored_text) {
            const parsedObj = JSON.parse(stored_text) as StrictMovieInfo;
            movieEditContext.setMovieInfo({ ...parsedObj });
            setInitialActors([...parsedObj.extraInfo.actors]);
            movieEditContext.setIsLoaded(true);
          }
        } catch (err) {
          console.error("Помилка завантаження фільму", err);
        }
      }
    };
    loadMovie();
  }, [id, movieEditContext]);

  useEffect(() => {
    if (movieEditContext.isLoaded) {
      localStorage.setItem("movie_edit", JSON.stringify(movieEditContext.movieInfo));
    }
  }, [movieEditContext.movieInfo, movieEditContext.isLoaded]);

  // Хендлери для фільму
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, mainInfo: { ...movie.mainInfo, title: e.target.value } });
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, runtime: Number(e.target.value) } });
  };

  const handleAddGenre = (genreId: string) => {
    const genre = availableGenres.find(g => g.id === Number(genreId));
    if (genre && !movie.extraInfo.genres.some(mg => mg.id === genre.id)) {
      movieEditContext.setMovieInfo({
        ...movie,
        extraInfo: { ...movie.extraInfo, genres: [...movie.extraInfo.genres, genre] }
      });
    }
  };

  const handleRemoveGenre = (id: number) => {
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: { ...movie.extraInfo, genres: movie.extraInfo.genres.filter(g => g.id !== id) }
    });
  };

  const handleAddActor = (selectedActor: Cast) => {
    const currentActors = movie.extraInfo.actors || [];
    if (!currentActors.some(a => a.id === selectedActor.id)) {
      movieEditContext.setMovieInfo({
        ...movie,
        extraInfo: { ...movie.extraInfo, actors: [...currentActors, selectedActor] }
      });
    }
  };

  const handleActorUpdate = (index: number, updatedActor: Cast) => {
    const newActors = [...movie.extraInfo.actors];
    newActors[index] = updatedActor;
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, actors: newActors } });
  };

  const handleRemoveActor = (actorId: number) => {
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: { ...movie.extraInfo, actors: movie.extraInfo.actors.filter(a => a.id !== actorId) }
    });
  };

  // --- ГОЛОВНА ЛОГІКА ОНОВЛЕННЯ ---
  const handleConfirm = async () => {
    const movieId = Number(id);
    const currentActors = movie.extraInfo.actors;

    try {
      // Оновлення основної інфи
      const movieSummary: MovieSummary = {
        id: movieId,
        title: movie.mainInfo.title,
        releaseDate: movie.mainInfo.releaseDate,
        posterPath: movie.mainInfo.posterPath,
        runtime: movie.extraInfo.runtime,
        overview: movie.extraInfo.overview
      };
      await movieApi.updateMovie(movieSummary);

      // Оновлення зв'язків Movie + Actor
      const actorsToDelete = initialActors.filter(
        ia => !currentActors.some(ca => ca.id === ia.id)
      );
      for (const actor of actorsToDelete) {
        await movieActorApi.deleteMovieActor({
          movieId,
          actorId: actor.id,
          character: actor.role || "Не вказано"
        });
      }

      if (currentActors.length > 0) {
        const actorsData: Actor[] = currentActors.map(a => ({
          id: a.id,
          name: a.name,
          photoUri: a.photoUri
        }));
        await actorApi.createActor(actorsData);
        await actorApi.updateActor(actorsData);

        const movieActorLinks: MovieActor[] = currentActors.map(a => ({
          movieId,
          actorId: a.id,
          character: a.role || "Не вказано"
        }));
        await movieActorApi.updateMovieActor(movieActorLinks);
      }

      // Оновлення зв'язків Movie + Genre
      if (movie.extraInfo.genres.length > 0) {
        const movieGenres: MovieGenre[] = movie.extraInfo.genres.map(g => ({
          movieId,
          genreId: g.id
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
    !movie.extraInfo.genres.some(mg => mg.id === ag.id)
  );

  const filteredTmdbCast = tmdbCast.filter(
    tmdbA => !movie.extraInfo.actors.some(ma => ma.id === tmdbA.id)
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
              {movie.extraInfo.genres.map(genre => (
                <span key={genre.id} className={styles.tag}>
                  {genre.name}
                  <button type="button" onClick={() => handleRemoveGenre(genre.id)} className={styles.removeTagBtn}>×</button>
                </span>
              ))}
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
          <div className={styles.actorsHeader}>
            <label>Актори</label>
            <button 
              className={styles.addActorMainBtn} 
              onClick={() => setShowActorPicker(!showActorPicker)}
            >
              {showActorPicker ? "Закрити список" : "+ Додати актора"}
            </button>
          </div>

          {showActorPicker && (
            <div className={styles.actorPicker}>
              {filteredTmdbCast.length > 0 ? (
                filteredTmdbCast.map(actor => (
                  <div key={actor.id} className={styles.pickerItem} onClick={() => handleAddActor(actor)}>
                    <img src={`https://image.tmdb.org/t/p/w200${actor.photoUri}`} alt="" />
                    <span>{actor.name}</span>
                  </div>
                ))
              ) : (
                <p>Усі актори з TMDB вже додані</p>
              )}
            </div>
          )}

          <div className={styles.actorsGrid}>
            {movie.extraInfo.actors?.map((actor, index) => (
              <AdminActorCard 
                key={actor.id} 
                actor={actor} 
                onSave={(updated) => handleActorUpdate(index, updated)}
                onRemove={() => handleRemoveActor(actor.id)}
              />
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