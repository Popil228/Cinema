import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchMoviePage.module.scss';
import * as moviesApi from '../../../api/movieApi';
import { type MovieInfo } from '../../../types/movie';

const SearchMoviePage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieInfo[]>([])
  const navigate = useNavigate();

  const handleSearchConfirm = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == "Enter")
    {
      
      if(query.trim().length<3) { return };
      console.log("enter key pressed")
      
      //VALIDATE search string here

      const searchResult = await moviesApi.searchMovies(query);
      setSearchResults(searchResult);
    }
  }

  const handleSelect = (movie: any) => {
    navigate('/admin/movies/add', { 
      state: { 
        baseData: {
          title: movie.title,
          posterUrl: movie.poster,
          year: movie.year
        } 
      } 
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Пошук фільму</h1>
      <input 
        className={styles.searchInput}
        placeholder="Введіть назву фільму..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleSearchConfirm}
      />

      <div className={styles.resultsGrid}>
        {searchResults.map((movie) => (
          <div key={movie.mainInfo?.id} className={styles.moviePlate} onClick={() => handleSelect(movie)}>
            <img src={movie.mainInfo?.posterPath} alt={movie.mainInfo?.title} />
            <div className={styles.plateInfo}>
              <h3>{movie.mainInfo?.title}</h3>
              <p>{new Date(movie.mainInfo?.releaseDate || "1999-01-01").getFullYear()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchMoviePage;