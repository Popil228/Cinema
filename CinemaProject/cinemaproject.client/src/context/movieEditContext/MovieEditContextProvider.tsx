import React, { type ReactNode, useState } from 'react';
import {type StrictMovieInfo } from '../../types/movie';
import {type MovieEditContextInterface } from "./MovieEditContextInterface";
import MoveEditContext from './MovieEditContext';

const MovieEditContextProvider:React.FC<{children?: ReactNode}> = ({children}) => {

  const blankMovieInfo:StrictMovieInfo = {
    mainInfo: {
      id: 0,
      title: "",
      releaseDate: "1999-01-01",
      posterPath: "/img"
    },
    extraInfo:{
      runtime: 0,
      overview: "",
      genres: [],
      actors: [],
    }
  }

  const [movieInfo, setMovieInfo] = useState<StrictMovieInfo>(blankMovieInfo as StrictMovieInfo);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const providerData:MovieEditContextInterface = {
    movieInfo: movieInfo,
    setMovieInfo: setMovieInfo,
    isLoaded: isLoaded,
    setIsLoaded: setIsLoaded,
  }

  return (
    <MoveEditContext.Provider value={providerData}>
      {children}
    </MoveEditContext.Provider> 
    )
}

export default MovieEditContextProvider
