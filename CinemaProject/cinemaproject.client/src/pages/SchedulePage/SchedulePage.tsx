import React, { useContext } from 'react';
import styles from './SchedulePage.module.scss';
import type { Session } from '../../types/movie';
import ScheduleDayDisplay from './pageComponents/ScheduleDayDisplay';
import useWindowWidth from '../../utilities/useWindowWidth';
import SearchBar from '../../components/SearchBar/SearchBar';
import SearchBarContext from '../../context/searchBarContext/SearchBarContext';
import { dateToDayMonthStrUA } from '../../utilities/dateToStringUA';

const SchedulePage: React.FC = () => {

  const sessions: Session[] = [
    {
      id: 1,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: new Date("2025-04-03"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 2,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-03"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 3,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-03"),
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
        {
      id: 4,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: new Date("2025-04-03"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 5,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-04"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 6,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-04"),
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
        {
      id: 7,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: new Date("2025-04-04"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 8,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-04"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 9,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-04"),
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
        {
      id: 10,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: new Date("2025-04-05"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 11,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-05"),
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 12,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: new Date("2025-04-05"),
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    }
  ];

  const windowWidth = useWindowWidth();
  const overflowWidth = 768;

  const searchBarData = useContext(SearchBarContext);

  const filteredSessions = searchBarData.isSearchEnabled ? 
  sessions.filter(s=>s.title.toLowerCase().includes(searchBarData.titleSearch.toLowerCase()))
  .filter((s)=>searchBarData.genreSearch=="" ? true : s.genres?.includes(searchBarData.genreSearch)||false)
  .filter((s)=>searchBarData.dateInput=="" ? true : (s.date.getDate()==searchBarData.dateSearch.getDate() &&
          s.date.getMonth()==searchBarData.dateSearch.getMonth()))
  : sessions
  
  //TODO TODO TODO TODO - уточнити формат дати і написати логіку сортування з урахуванням формату
  //TODO TODO  OPTIONAL - зробити динамічне сортування з єдиною конпкою очищення параметрів пошуку
  //TODO TODO TODO TODO  
  //TODO TODO TODO TODO
  //TODO TODO TODO TODO

  const splitByDateObj:{[key:string]:Session[]} = {}; //{"date_str": [Session, Session, ...], ...}
  filteredSessions.forEach((s)=>{
    const dateStr:string = dateToDayMonthStrUA(s.date); 
    if(!{}.propertyIsEnumerable.call(splitByDateObj,dateStr)){
        splitByDateObj[dateStr] = [];
    }
    splitByDateObj[dateStr].push(s);
  })
  const splitByDateArr:Session[][] = Object.keys(splitByDateObj).map((key)=>{return splitByDateObj[key]});

  const genres:string[] = [...new Set(sessions.flatMap(s=>s.genres||[]))]; //list of unique non-undefined genres


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