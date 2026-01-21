import React from 'react';
import styles from './SchedulePage.module.scss';
import type { Session } from '../../types/movie';
import ScheduleDayDisplay from './pageComponents/ScheduleDayDisplay';
import useWindowWidth from '../../utilities/useWindowWidth';


const SchedulePage: React.FC = () => {

  const sessions: Session[] = [
    {
      id: 1,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: "3 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 2,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "3 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 3,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "3 квітня",
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
        {
      id: 4,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: "3 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 5,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "4 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 6,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "4 квітня",
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
        {
      id: 7,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: "4 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 8,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "4 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 9,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "5 квітня",
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
        {
      id: 10,
      title: "Minecraft",
      genres: ["Комедія", "Трагедія"],
      date: "5 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'A'
    },
    {
      id: 11,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "5 квітня",
      time: "13:00",
      imageUrl: "/logo.png",
      hall: 'B'
    },
    {
      id: 12,
      title: "Дюна: Частина друга",
      genres: ["Фантастика", "Пригоди"], 
      date: "5 квітня",
      time: "16:00",
      imageUrl: "/logo.png",
      hall: 'B'
    }
  ];

  const windowWidth = useWindowWidth();
  const overflowWidth = 768;

  const splitByDateObj:{[key:string]:Session[]} = {}; //{"date_str": [Session, Session, ...], ...}

  sessions.forEach((s)=>{
    if(!{}.propertyIsEnumerable.call(splitByDateObj,s.date)){
        splitByDateObj[s.date] = [];
    }
    splitByDateObj[s.date].push(s);
  })

  const splitByDateArr:Session[][] = Object.keys(splitByDateObj).map((key)=>{return splitByDateObj[key]});

  return (
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
  );
};

export default SchedulePage;