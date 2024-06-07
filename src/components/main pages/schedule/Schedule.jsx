// src/components/Schedule.js
import React, { useState } from 'react';
import ScheduleTable from './ScheduleTable';
import LessonForm from './LessonForm';
import styles from './Schedule.module.scss';

const initialSchedule = {
  Monday: [
    { time: '09:00 - 10:00', subject: 'Math' },
    { time: '10:00 - 11:00', subject: 'English' },
  ],
  Tuesday: [
    { time: '09:00 - 10:00', subject: 'Science' },
    { time: '10:00 - 11:00', subject: 'History' },
  ],
  Wednesday: [
    { time: '09:00 - 10:00', subject: 'Science' },
    { time: '10:00 - 11:00', subject: 'History' },
  ],
  Thursday: [
    { time: '09:00 - 10:00', subject: 'Science' },
    { time: '10:00 - 11:00', subject: 'History' },
  ],
  Friday: [
    { time: '09:00 - 10:00', subject: 'Science' },
    { time: '10:00 - 11:00', subject: 'History' },
  ],
  Saturday: [
    { time: '09:00 - 10:00', subject: 'Science' },
    { time: '10:00 - 11:00', subject: 'History' },
  ],
  // Add other days as needed
};

const Schedule = () => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleUpdateLesson = (day, index, updatedLesson) => {
    const updatedDay = schedule[day].map((lesson, i) =>
      i === index ? updatedLesson : lesson
    );
    setSchedule({ ...schedule, [day]: updatedDay });
  };

  const handleAddLesson = (day, newLesson) => {
    setSchedule({ ...schedule, [day]: [...schedule[day], newLesson] });
  };

  const handleDeleteLesson = (day, index) => {
    const updatedDay = schedule[day].filter((_, i) => i !== index);
    setSchedule({ ...schedule, [day]: updatedDay });
  };

  return (
    <div className={styles.scheduleContainer}>
      {Object.keys(schedule).map((day) => (
        <div key={day} className={styles.dayContainer}>
          <h2>{day}</h2>
          <ScheduleTable
            day={day}
            lessons={schedule[day]}
            onUpdateLesson={handleUpdateLesson}
            onDeleteLesson={handleDeleteLesson}
          />
          <LessonForm day={day} onAddLesson={handleAddLesson} />
        </div>
      ))}
    </div>
  );
};

export default Schedule;
