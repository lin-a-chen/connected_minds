// src/components/LessonForm.js
import React, { useState } from 'react';
import styles from './LessonForm.module.scss';
import standartStyles from '@/styles/Styles.module.scss';
import { useForm, Controller } from "react-hook-form";
import { LuCross } from 'react-icons/lu';

export default function LessonForm({ day, onAddLesson }){

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    control,
    handleSubmit,
    reset
} = useForm({});

  const submitLesson = async (data) => {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(submitLesson)} className={`${styles.form}`}>
      <fieldset>
          <label>Час*</label>
        <input type="time" className={`${standartStyles.inputRegular}`} {...register("subjectStartTime", { required: "Час початку не може бути пустим" 
        })} />
        {errors.subjectStartTime && <span className={standartStyles.errorMessage}>{errors.subjectStartTime.message}</span>}
    </fieldset>
    <div className={styles.subjectText}>
      <fieldset>
          <label>Назва предмету*</label>
          <input type="text" className={`${standartStyles.inputRegular}`} placeholder="Біологія" {...register("subjectName", { required: "Назва не може бути пустою" 
          })} />
          {errors.subjectName && <span className={standartStyles.errorMessage}>{errors.subjectName.message}</span>}
      </fieldset>
      <fieldset>
          <label>ПІБ викладача*</label>
          <select type="text" className={`${standartStyles.inputRegular}`} {...register("teachersFullname", { required: "Ім'я викладача потрібно обрати"
          })}>
            <option value=''>Оберіть викладача</option>
          </select>
          {errors.teachersFullname && <span className={standartStyles.errorMessage}>{errors.teachersFullname.message}</span>}
      </fieldset>      
    </div>
    
      <button className={styles.buttonAdd} type="submit"><LuCross/></button>
    </form>
  );
};