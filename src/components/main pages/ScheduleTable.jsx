import React, { useState } from 'react';
import Lesson from './Lesson';
import styles from './ScheduleTable.module.scss';
import Loading from '../modals/Loading';

const ScheduleTable = ({ day, lessons, onUpdateLesson, onDeleteLesson }) => {

  const hasNullOrUndefinedProperties = (obj) => {
    for (let key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        return true;
      }
    }
    return false;
  };
  
  return (
    <div className={styles.table}>
        {lessons && lessons.length > 0 ? lessons.map((lesson, index) => 
          !hasNullOrUndefinedProperties(lesson) ? (
            <Lesson
              key={index}
              lesson={lesson}
              onUpdate={onUpdateLesson}
              onDelete={() => onDeleteLesson(day, index)}
            />
          ) : null
        )
      :
      <Loading/>
      }
    </div>
  );
};

export default ScheduleTable;