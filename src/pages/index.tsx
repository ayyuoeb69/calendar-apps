import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Calendar.module.css';
import { months, weekdays } from '@/constants/global';
import CalendarDays from '@/components/CalendarDays';
import { Inter } from 'next/font/google';
import Swal from 'sweetalert2';
import { CalendarData } from '@/types/global';

const inter = Inter({ subsets: ['latin'] })

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [calendarData, setCalendarData] = useState<CalendarData>({});

  useEffect(() => {
    setCalendarData(localStorage.getItem('calendarLs') ? JSON.parse(localStorage.getItem('calendarLs') || '') : {})
  }, [])

  const handleAddCalendar = async ({date}: {date: string}) => {
    Swal.fire({
      title: `<span class="${inter.className}">Add Event</span>`,
      html:
        `<div class="${inter.className} ${styles.formContainer}">`+
          '<label>Name Event</label><br/>'+
          '<input id="name" type="text" class="swal2-input"><br/>'+
          '<label>Time Event</label><br/>'+
          '<input id="time" type="time" class="swal2-input"><br/>' +
          '<label>Invitees By Email</label><br/>'+
          '<input id="email" type="email" class="swal2-input">' +
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      confirmButtonText: 'Submit',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const inputName = (document.getElementById('name') as HTMLInputElement)?.value;
        const inputTime = (document.getElementById('time') as HTMLInputElement)?.value;
        const emailTime = (document.getElementById('email') as HTMLInputElement)?.value;
        const event = {
          'name': inputName,
          'time': inputTime,
          'email': emailTime,
        }
        const updatedCalendarData = { ...calendarData };
        if (updatedCalendarData[date]) {
          updatedCalendarData[date] = [...updatedCalendarData[date], event];
        } else {
          updatedCalendarData[date] = [event];
        }
        localStorage.setItem('calendarLs', JSON.stringify(updatedCalendarData));
        setCalendarData(updatedCalendarData);
      }
    });
  }

  const handleEditCalendar = async ({date, index}: {date: string, index: number}) => {
    const eventDetail = calendarData[date][index];
    Swal.fire({
      title: `<span class="${inter.className}">Edit Event</span>`,
      html:
        `<div class="${inter.className} ${styles.formContainer}">`+
          '<label>Name Event</label><br/>'+
          `<input width="100%" id="name" type="text" value="${eventDetail.name}" class="swal2-input"><br/>`+
          '<label>Time Event</label><br/>'+
          `<input width="100%" id="time" type="time" value="${eventDetail.time}" class="swal2-input"><br/>` +
          '<label>Invitees By Email</label><br/>'+
          `<input width="100%" id="email" type="email" value="${eventDetail.email}" class="swal2-input">` +
        '</div>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'red',
      confirmButtonText: 'Edit',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const inputName = (document.getElementById('name') as HTMLInputElement)?.value;
        const inputTime = (document.getElementById('time') as HTMLInputElement)?.value;
        const emailTime = (document.getElementById('email') as HTMLInputElement)?.value;
        const event = {
          'name': inputName,
          'time': inputTime,
          'email': emailTime,
        }
        const updatedCalendarData = { ...calendarData };
        updatedCalendarData[date][index] = event;
        localStorage.setItem('calendarLs', JSON.stringify(updatedCalendarData));
        setCalendarData(updatedCalendarData);
      }
    });
  }

  const handleDeleteEvent = ({date, eventIndex}: {date: string, eventIndex: number}) => {
    const updatedCalendarData = { ...calendarData };
    if (updatedCalendarData[date]) {
      updatedCalendarData[date].splice(eventIndex, 1);
      localStorage.setItem('calendarLs', JSON.stringify(updatedCalendarData));
      setCalendarData(updatedCalendarData);
    }
  };

  const nextMonth = () => {
    if(currentMonth === 11){
      setCurrentYear(year => year + 1);
      setCurrentMonth(0);
    }else{
      setCurrentMonth(month => month + 1);
    }
  }

  const previousMonth = () => {
    if(currentMonth === 0){
      setCurrentYear(year => year - 1);
      setCurrentMonth(11);
    }else{
      setCurrentMonth(month => month - 1);
    }
  }

  return (
    <>
      <Head>
        <title>Calendar Apps</title>
        <meta name="description" content="calendar apps" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={inter.className}>
        <div className={styles.calendar}>
          <div className={styles["calendar-header"]}>
            <div className={styles.title}>
              <h2>{months[currentMonth]} {currentYear}</h2>
            </div>
            <div className={styles.tools}>
              <button onClick={previousMonth}>
                &#8592;
              </button>
              <p>{months[currentMonth].substring(0, 3)} {currentYear}</p>
              <button onClick={nextMonth}>
                 &#8594;
              </button>
            </div>
          </div>
          <div className={styles["calendar-body"]}>
            <div className={styles["table-header"]}>
              {
                weekdays.map((weekday, idx) => {
                  return <div key={idx} className={styles.weekday}><p>{weekday}</p></div>
                })
              }
            </div>
            <CalendarDays 
              today={today} 
              currentMonth={currentMonth} 
              currentYear={currentYear}
              handleAddCalendar={handleAddCalendar} 
              handleEditCalendar={handleEditCalendar}
              events={calendarData}
              handleDeleteEvent={handleDeleteEvent}
            />
          </div>
        </div>
      </main>
    </>
  )
}
