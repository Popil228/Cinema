import React from 'react';
import styles from './ScheduleDayDisplay.module.scss';
import type { Session } from '../../../types/movie';
import SessionItem from '../../../components/SessionItem/SessionItem';
import useWindowWidth from '../../../utilities/useWindowWidth';
import { dateToDayMonthStrUA } from '../../../utilities/dateToStringUA';

interface ScheduleDayDisplayProps{
    sessions: Session[]
}

const ScheduleDayDisplay:React.FC<ScheduleDayDisplayProps> = ({sessions}: ScheduleDayDisplayProps) => {

    const dateStr:string = dateToDayMonthStrUA(sessions[0].date);
    const windowWidth = useWindowWidth();
    const overflowWidth = 768;

    const sesssions_A = sessions.filter((s)=>s.hall=="A");
    const sesssions_B = sessions.filter((s)=>s.hall=="B");
    return (
        <div>
            <h3>{dateStr}</h3>
            <div className={styles.sessionsWrapper}>
                {windowWidth<=overflowWidth&&<h3>Зал A</h3>}
                <div className={styles.sessionsColumn}>
                    {sesssions_A.map((s)=><SessionItem 
                    session={s}
                    showDate={false} showTime={true}/>)}
                </div>
                {windowWidth<=overflowWidth&&<h3>Зал B</h3>}
                <div className={styles.sessionsColumn}>
                    {sesssions_B.map((s)=><SessionItem 
                    session={s}
                    showDate={false} showTime={true}/>)}
                </div>
            </div>
        </div>
    )
}

export default ScheduleDayDisplay
