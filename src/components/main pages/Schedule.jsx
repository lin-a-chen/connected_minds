// src/components/Schedule.js
import React, { useState } from "react";
import ScheduleTable from "./ScheduleTable";
import LessonForm from "./LessonForm";
import styles from "./Schedule.module.scss";
import Loading from "../modals/Loading";

const Schedule = ({ week, subjects, onUpdate }) => {

	const weekdays = {
		1: "Понеділок",
		2: "Вівторок",
		3: "Середа",
		4: "Четвер",
		5: "П'ятниця",
		6: "Субота",
	};

	// const [schedule, setSchedule] = useState([]);

	// const initialSchedule = scheduleArray.reduce((acc, curr) => {
	//   const day = weekdays[curr.weekday];
	//   const time = `${curr.start_time.slice(0, 5)} - ${curr.end_time.slice(0, 5)}`;
	//   const subject = subjects[curr.subject_id];

	//   if (!acc[day]) {
	//     acc[day] = [];
	//   }

	//   acc[day].push({ time, subject });

	//   return acc;
	// }, {});

	const handleUpdateLesson = (day, index, updatedLesson) => {
		// const updatedDay = schedule[day].map((lesson, i) =>
		//   i === index ? updatedLesson : lesson
		// );
		// setSchedule({ ...schedule, [day]: updatedDay });
		onUpdate();
	};

	const handleAddLesson = (day, newLesson) => {
		onUpdate();
	//   setSchedule({ ...schedule, [day]: [...schedule[day], newLesson] });
	};

	// const handleDeleteLesson = (day, index) => {
	//   const updatedDay = schedule[day].filter((_, i) => i !== index);
	//   setSchedule({ ...schedule, [day]: updatedDay });
	// };

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
								// onDeleteLesson={handleDeleteLesson}
							/>
							<LessonForm day={day} onAddLesson={handleAddLesson} />
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default Schedule;
