import React, { useContext, useEffect } from 'react';
import styles from './SchedulePage.module.scss';
import ScheduleDayDisplay from './pageComponents/ScheduleDayDisplay';
import useWindowWidth from '../../utilities/useWindowWidth';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchBarContext from '../../context/searchBarContext/SearchBarContext';
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';
import { type SessionDto } from '../../api/sessionsApi';
import { useFutureSessions } from '../../hooks/ReactQueryHooks';

const SchedulePage: React.FC = () => {
  const windowWidth = useWindowWidth();
  const overflowWidth = 768;

  const sessions = useFutureSessions();

  const searchBarData = useContext(SearchBarContext);

  useEffect(() => {
    //implement query error handling
  },[])

  const filteredSessions = searchBarData.isSearchEnabled && (typeof sessions.data != "undefined") ? 
  sessions.data.filter(s=>s.movieTitle.toLowerCase().includes(searchBarData.titleSearch.toLowerCase()))
  .filter((s)=>searchBarData.genreSearch=="" ? true : s.movieGenres?.includes(searchBarData.genreSearch)||false)
  .filter((s)=>searchBarData.dateInput=="" ? true : (new Date(s.startTime).getDate()==searchBarData.dateSearch.getDate() &&
          new Date(s.startTime).getMonth()==searchBarData.dateSearch.getMonth()))
  : (typeof sessions.data == "undefined" ? [] : sessions.data);

  const splitByDateObj:{[key:string]:SessionDto[]} = {}; //{"date_str": [Session, Session, ...], ...}
  filteredSessions.forEach((s)=>{
    const dateStr:string = dateToDayMonthStrUA(new Date(s.startTime)); 
    if(!{}.propertyIsEnumerable.call(splitByDateObj,dateStr)){
        splitByDateObj[dateStr] = [];
    }
    splitByDateObj[dateStr].push(s);
  })
  const splitByDateArr:SessionDto[][] = Object.keys(splitByDateObj).map((key)=>{return splitByDateObj[key]})
  .sort((a, b) => 
  {
    if(a[0].startTime > b[0].startTime)
    { return 1; }
    else
    { return -1;}
  })

  const genres:string[] = [...new Set((sessions.data||[]).flatMap(s=>s.movieGenres||[]))]; //list of unique non-undefined genres


  return (
    <>
      <SearchBar genres={genres}></SearchBar>
      <div className={styles.container}>
        <h1>Розклад сеансів</h1>
        {windowWidth>overflowWidth&&
        <div className={styles.hallsHeader}>
          <h3 className={styles.hallTitle}>Зал A</h3> 
          <h3  className={styles.hallTitle}>Зал B</h3>
        </div>
        }
        {splitByDateArr.map(s=><ScheduleDayDisplay sessions={s}/>)}
      </div>
    </>
  );
};

export default SchedulePage;