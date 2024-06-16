import ScheduleTable from "./ScheduleTable";
import styles from "./Schedule.module.scss";
import Loading from "../../modals/Loading";

const SchoolchildSchedule = ({ week, onUpdate, userRole, schoolchild }) => {
	const weekFiltered = [];

	week.forEach((day) => {
		const dayFiltered = [];
		day.map((lesson) => {
			if (lesson.class_id === schoolchild.class_id) {
				dayFiltered.push(lesson);
			}
		});

		if (dayFiltered.length === 0) {
			dayFiltered.push({
				antroponym: null,
				class_id: null,
				classes_type: null,
				end_time: null,
				firstname: null,
				lastname: null,
				lesson_id: null,
				schedule_id: null,
				start_time: null,
				subject_id: null,
				subject_name: null,
				teacher_email: null,
				teacher_id: null,
				weekday: day[0].weekday,
			});
		}

		weekFiltered.push(dayFiltered);
	});

	const weekdays = {
		0: "Понеділок",
		1: "Вівторок",
		2: "Середа",
		3: "Четвер",
		4: "П'ятниця",
		5: "Субота",
	};

	const handleUpdateLesson = () => {
		onUpdate();
	};

	return (
		<>
			{!weekFiltered || (weekFiltered.length <= 0 && <Loading />)}

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
							/>
						</div>
					))}
				</div>
			)}
		</>
	);
};

export default SchoolchildSchedule;
