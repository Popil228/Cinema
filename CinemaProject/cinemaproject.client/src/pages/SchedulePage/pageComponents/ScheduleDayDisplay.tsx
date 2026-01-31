import React from 'react';
import styles from './ScheduleDayDisplay.module.scss';
import SessionItem from '../../../components/SessionItem/SessionItem';
import useWindowWidth from '../../../utilities/useWindowWidth';
import { dateToDayMonthStrUA } from '../../../utilities/dateToStringUA';
import { type SessionDto } from '../../../api/sessionsApi';

interface ScheduleDayDisplayProps{
    sessions: SessionDto[]
}

const ScheduleDayDisplay:React.FC<ScheduleDayDisplayProps> = ({sessions}: ScheduleDayDisplayProps) => 
{
    const sessionStartTimeDate = new Date(sessions[0].startTime);
    const dateStr:string = dateToDayMonthStrUA(sessionStartTimeDate);
    const windowWidth = useWindowWidth();
    const overflowWidth = 768;

    const sesssions_A = sessions.filter((s)=>s.hallId==1);
    const sesssions_B = sessions.filter((s)=>s.hallId==2);
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
