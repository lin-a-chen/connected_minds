// src/components/Schedule.js
import React, { useEffect, useState } from "react";
import ScheduleTable from "./ScheduleTable";
import LessonForm from "./LessonForm";
import styles from "./Schedule.module.scss";
import Loading from "../modals/Loading";

const TeacherSchedule = ({ week, subjects, onUpdate, userRole, teacher }) => {

	const weekFiltered = [];
	week.forEach(day => {
		const dayFiltered = [];
		day.map(lesson => {
			if (lesson.teachers_id === teacher.id || lesson.teachers_id === null){
				dayFiltered.push(lesson);
			}
		});

		if (dayFiltered.length === 0){
			dayFiltered.push({antroponym: null, class_id: null, classes_type: null, end_time: null, firstname: null,
				lastname: null, lesson_id: null, schedule_id: null, start_time: null, subject_id: null,
				subject_name: null, teachers_email: null, teachers_id: null, weekday: 1
		});
		}
		
		weekFiltered.push(dayFiltered);
	})

	console.log('weekFiltered', weekFiltered)
	console.log('week', week)

	const weekdays = {
		1: "Понеділок",
		2: "Вівторок",
		3: "Середа",
		4: "Четвер",
		5: "П'ятниця",
		6: "Субота",
	};

	const handleUpdateLesson = (day, index, updatedLesson) => {
		onUpdate();
	};

	const handleAddLesson = (day, newLesson) => {
		onUpdate();
	};

	return (
		<>
			{!weekFiltered || weekFiltered.length <= 0 && <Loading />}

			{weekFiltered && weekFiltered.length > 0 && (
				<div className={styles.scheduleContainer}>
					{weekFiltered.map((day, index) => (
						<div
							key={index}
							className={styles.dayContainer}>
							<h2>{weekdays[day[0].weekday]}</h2>
							<ScheduleTable
								day={day}
								lessons={day}
								onUpdateLesson={handleUpdateLesson}
								userRole={userRole}
								teacher={teacher}
							/>
							{userRole === 'INSTITUTION_ADMIN' && <LessonForm day={day} onAddLesson={handleAddLesson} />}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default TeacherSchedule;
