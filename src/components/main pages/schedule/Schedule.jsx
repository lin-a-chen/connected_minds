import React, { useState } from "react";
import ScheduleTable from "./ScheduleTable";
import LessonForm from "./LessonForm";
import styles from "./Schedule.module.scss";
import Loading from "../../modals/Loading";

const Schedule = ({ week, subjects, onUpdate, userRole }) => {

	const weekdays = {
		0: "Понеділок",
		1: "Вівторок",
		2: "Середа",
		3: "Четвер",
		4: "П'ятниця",
		5: "Субота",
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
			{console.log('eweek', week)}
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
