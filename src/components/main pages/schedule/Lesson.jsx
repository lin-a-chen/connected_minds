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
              name="time"
              value={editedLesson.time}
              onChange={handleChange}
            />
          </td>
          <td className={styles.subjectText}>
            <input
              className={standartStyles.inputRegular}
              type="text"
              name="subject"
              value={editedLesson.subject}
              onChange={handleChange}
            />
            <input
              className={standartStyles.inputRegular}
              type="text"
              name="teacher"
              value="{editedLesson.teacher}"
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
          <td className={`${styles.subjectTime}`}><p>07-00</p><div className={styles.dash}></div><p>08-00</p></td>
          <td className={styles.subjectText}>
            <p><a>{lesson.subject}</a></p>
            <p><div className={styles.icon}><FaChalkboardTeacher/></div><a>lesson.teacher</a></p>
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