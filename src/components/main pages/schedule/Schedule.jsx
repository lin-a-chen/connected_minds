// src/components/Schedule.js
import React, { useState } from "react";
import ScheduleTable from "./ScheduleTable";
import LessonForm from "./LessonForm";
import styles from "./Schedule.module.scss";
import Loading from "../../modals/Loading";

const Schedule = ({ week, subjects, onUpdate, userRole }) => {

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
			{!week || week.length <= 0 && <Loading />}

			{week && week.length > 0 && (
				<div className={styles.scheduleContainer}>
					{week.map((day, index) => (
						<div
							key={index}
							className={styles.dayContainer}>
							<h2>{weekdays[day[0].weekday]}</h2>
							<ScheduleTable
								day={day}
								lessons={day}
								onUpdateLesson={handleUpdateLesson}
								userRole={userRole}
							/>
							{userRole === 'INSTITUTION_ADMIN' && <LessonForm day={day} onAddLesson={handleAddLesson} />}
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default Schedule;
