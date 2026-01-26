import { useState, type ReactNode } from "react";
import { getMovieById as getMovieById_api } from "../../api/moviesApi";
import UserMoviesContext from "./UserMoviesContext";
import type { UserMoviesContextInterface } from "./UserMoviesContextInterface";
import type { StrictMovieInfo } from "../../types/movie";


const UserMoviesContextProvider:React.FC<{children?: ReactNode}> = ({children}) =>
{
    const [movies, setMovies] = useState<StrictMovieInfo[]>([]);

    const getMovieById = async (id: number) => {
        let result = movies.find(m=>m.mainInfo.id==id)
        if(typeof result == "undefined")
        {
            result = await getMovieById_api(id);
            addMovie(result);
        }
        return result;
    }

    const addMovie = (movie: StrictMovieInfo) => 
    {
        setMovies([...movies, movie]);
    }

    const contextData:UserMoviesContextInterface = {
        movies: movies,
        setMovies: setMovies,
        getMovieById: getMovieById,
        addMovie: addMovie,
    }

    return(
        <UserMoviesContext.Provider value={contextData}>
            {children}
        </UserMoviesContext.Provider>
    )
}

export default UserMoviesContextProvider;