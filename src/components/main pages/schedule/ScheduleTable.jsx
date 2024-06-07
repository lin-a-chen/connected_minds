import React from 'react';
import Lesson from './Lesson';
import styles from './ScheduleTable.module.scss';
import { TbNotebook, TbClock2 } from "react-icons/tb";

const EditableTable = ({ day, lessons, onUpdateLesson, onDeleteLesson }) => {
  return (
    <table className={styles.table}>
      <tbody>
        {lessons.map((lesson, index) => (
          <Lesson
            key={index}
            lesson={lesson}
            onUpdate={(updatedLesson) => onUpdateLesson(day, index, updatedLesson)}
            onDelete={() => onDeleteLesson(day, index)}
          />
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
