import React, { useContext, useState } from 'react';
import styles from "./SearchBar.module.scss";
import SearchBarContext from '../../context/searchBarContext/searchBarContext';

interface SearchBarProps
{
    genres: string[]
}
const SearchBar:React.FC<SearchBarProps> = ({genres}) => {

    const [titleFilter, setTitleFilter] = useState<string>("");
    const [genreFilter, setGenreFilter] = useState<string>("");
    const [dateInput, setDateInput] = useState<string>("");
    //const [dateFilter, setDateFilter] = useState<Date>(new Date);

    const searchBarData = useContext(SearchBarContext);

    const handeSearch = () =>
    {
        searchBarData.setTitleSearch(titleFilter);
        searchBarData.setGenreSearch(genreFilter);
        searchBarData.setDateInput(dateInput);
        searchBarData.setSearchEnabled(true);
    }

    const handeClearSearch = () =>
    {
        searchBarData.setTitleSearch("");
        searchBarData.setGenreSearch("");
        searchBarData.setDateInput("");
        searchBarData.setSearchEnabled(false);
    }

    return (
        <div className={styles.searchBar}>
            <div className={styles.inputFields}>
                <input type='text' placeholder='Назва фільму' className={styles.inputField}
                value={titleFilter} onChange={(e)=>{setTitleFilter(e.target.value)}}/>
                <div className={styles.bottomInputFields}>
                    <input type='date' placeholder='Дата' className={styles.inputField} 
                    value={dateInput} onChange={(e)=>{setDateInput(e.target.value)}}/>
                    <input type='text' list='genres_list' placeholder='Жанр' className={styles.inputField}
                    value={genreFilter} onChange={(e)=>{setGenreFilter(e.target.value)}}/>
                    <datalist id='genres_list'> {genres.map(g=><option>{g}</option>)} </datalist>
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
    )
}

export default SearchBar
