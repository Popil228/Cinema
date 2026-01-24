import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchMoviePage.module.scss';
import * as movieApi from '../../../api/movieApi';
import { type MovieInfo, type StrictMovieInfo } from '../../../types/movie';
import MoveEditContext from '../../../context/movieEditContext/MovieEditContext';

const SearchMoviePage: React.FC = () => {
  //const [query, setQuery] = useState<string>('');
  const [searchStr, setSearchStr] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieInfo[]>([])
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const navigate = useNavigate();

  const movieEditContext = useContext(MoveEditContext);

  const handleSearchConfirm = async (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key == "Enter")
    {
      
      if(searchStr.trim().length<3) { return };
      console.log("enter key pressed")
      
      //VALIDATE search string here
      try{
        setSearchResults(await movieApi.searchMovies(searchStr))
        setIsError(false);
      }
      catch(err)
      {
        setIsError(true);
        if(err instanceof Error)
        {
          console.log("error caugth");
          setErrorMsg(err.message);
        }
        else
        {
          console.error(err)
          setErrorMsg("Error type - unknown. For details check console")
        }
      }
      
    }
  }

  const handleSelect = async (movie: MovieInfo) => {
    if(movie.mainInfo === null)
    {
      console.error("Cannot add/edit null movie");
      return;
    }

    try{
      const movieExtraInfo:MovieInfo = await movieApi.getMovieInfoByIdTMDB(movie.mainInfo.id);
      movie.extraInfo = movieExtraInfo.extraInfo;
      if(movie.extraInfo===null)
      {
        throw new Error(`movie id:${movie.mainInfo.id} extra info was null`);
      }
    }
    catch(err: unknown)
    {
      if(err instanceof Error)
        {
          console.error(err.message);
        }
        else
        {
          console.error(err);
        }
      return;
    }

    movieEditContext.setMovieInfo({mainInfo:movie.mainInfo, extraInfo: movie.extraInfo} as StrictMovieInfo);
    movieEditContext.setIsLoaded(true);
    navigate('/admin/movies/add');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Пошук фільму</h1>
      <input 
        className={styles.searchInput}
        placeholder="Введіть назву фільму..."
        value={searchStr}
        onChange={(e) => setSearchStr(e.target.value)}
        onKeyDown={handleSearchConfirm}
      />
      {isError && <>
        <h1 className={styles.title}>Помилка пошуку</h1>
        <p className={styles.errorText}>{errorMsg}</p>
      </>}
      {!isError && 
      <div className={styles.resultsGrid}>
        {searchResults.map((movie) => (
          <div key={movie.mainInfo?.id} className={styles.moviePlate} onClick={() => handleSelect(movie)}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.mainInfo?.posterPath}`} 
            alt={movie.mainInfo?.title} />
            <div className={styles.plateInfo}>
              <h3>{movie.mainInfo?.title}</h3>
              <p>{new Date(movie.mainInfo?.releaseDate || "1999-01-01").getFullYear()}</p>
            </div>
          </div>
        )) || <></>}
      </div>
      }
    </div>
  );
};

export default SearchMoviePage;
