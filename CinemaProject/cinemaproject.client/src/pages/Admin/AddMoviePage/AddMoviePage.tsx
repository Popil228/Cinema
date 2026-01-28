import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../EditMoviePage/EditMoviePage.module.scss';
import type { Cast, Genre, MovieSummary } from '../../../types/movie';
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

const AddMoviePage: React.FC = () => {
  const navigate = useNavigate();
  const movieEditContext = useContext(MoveEditContext);
  const movie = movieEditContext.movieInfo;

  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await genresApi.getAllGenres();
        setAvailableGenres(genres);
      } catch (err) {
        console.error("Помилка завантаження жанрів:", err);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!movieEditContext.isLoaded) {
      const stored = localStorage.getItem("movie_add_temp");
      if (stored) {
        movieEditContext.setMovieInfo(JSON.parse(stored));
        movieEditContext.setIsLoaded(true);
      }
    } else {
      localStorage.setItem("movie_add_temp", JSON.stringify(movieEditContext.movieInfo));
    }
  }, [movieEditContext.movieInfo]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, mainInfo: { ...movie.mainInfo, title: e.target.value } });
  };

  const handleRuntimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, runtime: Number(e.target.value) } });
  };

  const handleAddGenre = (genreIdStr: string) => {
    const genre = availableGenres.find(g => g.id === Number(genreIdStr));
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

  const handleRemoveActor = (actorId: number) => {
    movieEditContext.setMovieInfo({
      ...movie,
      extraInfo: { ...movie.extraInfo, actors: movie.extraInfo.actors.filter(a => a.id !== actorId) }
    });
  };

  const handleActorUpdate = (index: number, updatedActor: Cast) => {
    const newActors = [...movie.extraInfo.actors];
    newActors[index] = updatedActor;
    movieEditContext.setMovieInfo({ ...movie, extraInfo: { ...movie.extraInfo, actors: newActors } });
  };

  // --- ПІДТВЕРДЖЕННЯ ТА ТРАНЗАКЦІЯ ---
  const handleConfirm = async () => {
    const movieId = movie.mainInfo.id;
    let isMovieCreated = false;

    try {
      const movieSummary: MovieSummary = {
        id: movieId,
        title: movie.mainInfo.title,
        releaseDate: movie.mainInfo.releaseDate,
        posterPath: movie.mainInfo.posterPath,
        runtime: movie.extraInfo.runtime,
        overview: movie.extraInfo.overview
      };
      await movieApi.createMovie(movieSummary);
      isMovieCreated = true;

      // Movie + Actor
      if (movie.extraInfo.actors.length > 0) {
        const actorsData: Actor[] = movie.extraInfo.actors.map(a => ({
          id: a.id,
          name: a.name,
          photoUri: a.photoUri
        }));
        await actorApi.createActor(actorsData);
        await actorApi.updateActor(actorsData);

        const movieActors: MovieActor[] = movie.extraInfo.actors.map(a => ({
          movieId,
          actorId: a.id,
          character: a.role || "Не вказано"
        }));
        await movieActorApi.createMovieActor(movieActors);
      }

      // Movie + Genre
      if (movie.extraInfo.genres.length > 0) {
        const movieGenres: MovieGenre[] = movie.extraInfo.genres.map(g => ({
          movieId,
          genreId: g.id
        }));
        await movieGenreApi.createMovieGenre(movieGenres);
      }

      localStorage.removeItem("movie_add_temp");
      alert("Фільм успішно додано!");
      navigate('/admin/movies');

    } catch (err) {
      console.error("Помилка при створенні фільму:", err);
      if (isMovieCreated) {
        await movieApi.deleteMovieById(movieId);
      }
      alert(`Помилка: ${err instanceof Error ? err.message : "Невідома помилка"}`);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem("movie_add_temp");
    navigate('/admin/movies/search');
  };

  if (!movieEditContext.isLoaded) return <h2 className={styles.noMovieInfoMsg}>Завантаження...</h2>;
  
  const filteredGenres = availableGenres.filter(ag => 
    !movie.extraInfo.genres.some(mg => mg.id === ag.id)
  );

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.posterBlock}>
          <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo.posterPath}`} alt="Poster" />
        </div>
        <div className={styles.mainInfo}>
          <div className={styles.fieldGroup}>
            <label>Назва фільму</label>
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
              <select className={styles.genreSelect} onChange={(e) => { handleAddGenre(e.target.value); e.target.value = ""; }} value="">
                <option value="" disabled hidden>+ Додати жанр</option>
                {filteredGenres.map(g => (
                  <option key={g.id} value={g.id.toString()}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Тривалість (хв)</label>
            <input type="number" className={styles.editInput} value={movie.extraInfo.runtime} onChange={handleRuntimeChange} />
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.fieldGroup}>
          <label>Актори</label>
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

export default AddMoviePage;