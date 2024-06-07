import React, { useState } from 'react';
import styles from './Lesson.module.scss';
import standartStyles from '@/styles/Styles.module.scss';
import { TbPencilMinus, TbCheck } from 'react-icons/tb';
import { LuTrash2, LuCross } from 'react-icons/lu';
import { IoIosClose } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";

export default function Lesson ({ lesson, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLesson, setEditedLesson] = useState(lesson);

  console.log('lesson', lesson)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedLesson({ ...editedLesson, [name]: value });
  };

  const handleSave = () => {
    onUpdate(editedLesson);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  }

  return (
    <tr className={styles.lessonRow}>
      {isEditing ? (
        <>
          <td>
            <input
              className={`${standartStyles.inputRegular}
              ${styles.subjectTime}`}
              type="time"
              name="start_time"
              value={editedLesson.start_time}
              onChange={handleChange}
            />
            <input
              className={`${standartStyles.inputRegular}
              ${styles.subjectTime}`}
              type="time"
              name="end_time"
              value={editedLesson.end_time}
              onChange={handleChange}
            />
          </td>
          <td className={styles.subjectText}>
            <input
              className={standartStyles.inputRegular}
              type="text"
              name="subject_id"
              value={editedLesson.subject_name}
              onChange={handleChange}
            />
            <input
              className={standartStyles.inputRegular}
              type="text"
              name="teacher"
              value={editedLesson.teachers_email}
              onChange={handleChange}
            />
          </td>
          <td>
            <button
                    className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}
                    onClick={handleSave}
                  >
                    <TbCheck />
            </button>
            <button
                    className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                    onClick={() => setIsEditing(false)}
                  >
                    <IoIosClose/>
            </button>
          </td>
        </>
      ) : (
        <>
          <td className={`${styles.subjectTime}`}><p>{lesson.start_time}</p><div className={styles.dash}></div><p>{lesson.end_time}</p></td>
          <td className={styles.subjectText}>
            <p><a>{lesson.subject_name}</a></p>
            <div><div className={styles.icon}><FaChalkboardTeacher/></div><a href={`/api/institution/teacher?id=${lesson.teacher_id}`}>{`${lesson.lastname} ${lesson.firstname[0]}.${lesson.antroponym[0]}.`}</a></div>
            </td>
          <td>
            <button className={`${standartStyles.buttonEdit} ${standartStyles.buttonIconNoText}`}
                  onClick={handleEdit}>
              <TbPencilMinus />
            </button>
            <button
                className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
                onClick={() => handleDelete(item[uniqueField])}
              >
                <LuTrash2 />
            </button>
          </td>
        </>
      )}
    </tr>
  );
};