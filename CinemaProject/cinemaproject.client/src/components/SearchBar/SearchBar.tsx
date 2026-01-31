import React, { useContext, useState } from 'react';
import styles from "./SearchBar.module.scss";
import SearchBarContext from '../../context/searchBarContext/SearchBarContext';
import { useNowShowingMovies } from '../../hooks/ReactQueryHooks';

interface SearchBarProps
{
    genres: string[]
}
const SearchBar:React.FC<SearchBarProps> = ({genres}) => {

    const [titleFilter, setTitleFilter] = useState<string>("");
    const [genreFilter, setGenreFilter] = useState<string>("");
    const [dateInput, setDateInput] = useState<string>("");

    const searchBarData = useContext(SearchBarContext);
    const nowShowingMovies = useNowShowingMovies();
    const movies_titles = nowShowingMovies.isSuccess ? 
    (nowShowingMovies.data || []).map(m=>m.mainInfo.title) : [];

    const handeSearch = () =>
    {
        searchBarData.setTitleSearch(titleFilter);
        searchBarData.setGenreSearch(genreFilter);
        searchBarData.setDateInput(dateInput);

        if(dateInput!=""){
            searchBarData.setDateSearch(new Date(dateInput));
        }

        searchBarData.setSearchEnabled(true);
    }

    const handeClearSearch = () =>
    {
        setTitleFilter("");
        setGenreFilter("");
        setDateInput("");
        searchBarData.setSearchEnabled(false);
    }

    return (
        <div className={styles.searchBarContainer}>
        <div className={styles.searchBar}>
            <div className={styles.inputFields}>
                <input type='text' list="movies-list" placeholder='Назва фільму' className={styles.inputField}
                value={titleFilter} onChange={(e)=>{setTitleFilter(e.target.value)}}/>
                <datalist id="movies-list">
                    { movies_titles.map(m=><option>{m}</option>) }
                </datalist>
                <div className={styles.bottomInputFields}>
                    <input type='date' placeholder='Дата' className={styles.inputField} 
                    value={dateInput} onChange={(e)=>{setDateInput(e.target.value)}}/>
                    <input type='text' list='genres-list' placeholder='Жанр' className={styles.inputField}
                    value={genreFilter} onChange={(e)=>{setGenreFilter(e.target.value)}}/>
                    <datalist id='genres-list'> {genres.map(g=><option>{g}</option>)} </datalist>
                </div>
            </div> 
            <div className={styles.searchBarButtons}>
                <button className={styles.searchBarBtn} onClick={handeSearch}>
                    Знайти
                </button>
                <button className={styles.searchBarBtn} onClick={handeClearSearch}>
                    Очистити
                </button>
            </div>
        </div>
        </div>
    )
}

export default SearchBar
