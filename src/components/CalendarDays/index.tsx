import React, { useMemo } from 'react';
import styles from '@/styles/CalendarDays.module.css';
import { CalendarData, EventItem } from '@/types/global';
import { generateRandomColor } from '@/utils/randomColor';

interface Props {
  today: Date;
  handleAddCalendar: ({date}: {date: string}) => void;
  currentMonth: number;
  currentYear: number;
  events: CalendarData;
  handleEditCalendar: ({date, index}: {date: string, index: number}) => void;
  handleDeleteEvent: ({date, eventIndex}: {date: string, eventIndex: number}) => void 
}

interface Day {
  currentMonth: boolean;
  date: Date;
  number: number;
  selected: boolean;
  events: EventItem[];
}

const CalendarDays = (props: Props) => {
  
  const currentDaysMemo = useMemo(() => {
    const firstDayOfMonth = new Date(props.currentYear, props.currentMonth, 1);
    const weekdayOfFirstDay = firstDayOfMonth.getDay();
    const currentDays: Day[] = [];

    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } else if (day === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }
        const calendarDay: Day = {
            currentMonth: (firstDayOfMonth.getMonth() === props.currentMonth),
            date: new Date(firstDayOfMonth),
            number: firstDayOfMonth.getDate(),
            selected: (firstDayOfMonth.toDateString() === props.today.toDateString() && props.currentMonth === props.today.getMonth()),
            events: props.events[firstDayOfMonth.toDateString()] || []
        };

        currentDays.push(calendarDay);
    }
    return currentDays;
 }, [props])

  return (
    <div className={styles["table-content"]}>
      {
        currentDaysMemo.map((day, idx) => {
          return (
            <div
                key={idx}
              className={`${styles['calendar-day']} ${day.currentMonth && styles.current} ${day.selected && styles.selected}`}
              {...(day.events?.length === 0 && { onClick: () => props.handleAddCalendar({date: day.date.toDateString()}) })}
            >
              <div className={styles['calendar-event-wrap']} {...(day.events?.length < 3 && { onClick: () => props.handleAddCalendar({date: day.date.toDateString()}) })} >
                <span className={styles['calendar-event-add']}>
                    &#10010;
                </span>
                <h3><b>{day.number}</b></h3>
              </div>
              <br/>
              {day.events?.map((item,idxEvent) => {
                return(
                    <div key={idxEvent} className={styles.wrapItemEvent}>
                        <div className={styles.badge} style={{backgroundColor: generateRandomColor()}}>
                            <p onClick={() => props.handleEditCalendar({date: day.date.toDateString(), index: idxEvent})}>
                                {item.name}
                            </p>
                            <button className={styles.close} onClick={() => props.handleDeleteEvent({date: day.date.toDateString(), eventIndex: idxEvent})}>&times;</button>
                        </div>
                    </div>
                )
              })}
            </div>
          )
        })
      }
    </div>
  )
}

export default CalendarDays;
