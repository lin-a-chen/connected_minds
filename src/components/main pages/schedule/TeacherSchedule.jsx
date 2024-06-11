"use client";

import Schedule from "@/components/main pages/Schedule";
import { useEffect, useState } from "react";
import styles from "./SchedulePage.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import TeacherSchedule from "@/components/main pages/TeacherSchedule";

export default function TeacherSchedulePageComponent({userRole, user}) {
	const [week, setWeek] = useState([]);
	const [className, setClassName] = useState({ number: 1, letter: "А" });
	const [classLetters, setClassLetters] = useState([]);
	const [teacher, setTeacher] = useState(null);

    useEffect(() => {
		const fetchTeacher = async () => {
			const response = await fetch(
				`/api/institution/teachers?user-id=${user.id}`
			);
			const result = await response.json();

			if (!result.success) {
				console.error("Couldn't get teacher");
			}

			setTeacher(result.data);
		};

		fetchTeacher();
	}, []);

	const handleUpdate = () => {
		fetchSchedule();
	};

	const fetchSchedule = async () => {
		const response = await fetch(
			`/api/institution/schedule?class=${className.number}-${className.letter}`
		);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		} else {
			const groupedByWeekday = result.data.reduce((acc, current) => {
				const { weekday } = current;
				if (!acc[weekday]) {
					acc[weekday] = [];
				}
				acc[weekday].push(current);
				return acc;
			}, {});

			const sortedWeekdays = Object.keys(groupedByWeekday)
				.sort((a, b) => a - b)
				.map((key) => groupedByWeekday[key]);

			setWeek(sortedWeekdays);
		}
	};

	const fetchClasses = async () => {
		const response = await fetch(`/api/institution/classes`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const letters = result.data.map((el) => el.name.split("-")[1]);
		const uniqueLetters = [...new Set(letters)];
		setClassLetters(uniqueLetters);
	};

	useEffect(() => {
		fetchClasses();
	}, []);

	// const handleClassNumberChange = (e) => {
	// 	setClassName((prev) => ({
	// 		...prev,
	// 		number: +e.target.value,
	// 	}));
	// };

	// const handleClassLetterChange = (e) => {
	// 	setClassName((prev) => ({
	// 		...prev,
	// 		letter: e.target.value,
	// 	}));
	// };

	useEffect(() => {
		fetchSchedule();
	}, [className]);

	return (
		<div className={styles.schedulePage}>
			{/* <div className={styles.header}>
				<label>Клас*</label>
				<div>
					<input
						className={standartStyles.inputRegular}
						defaultValue="1"
						type="number"
						min="1"
						max="11"
						placeholder="1"
						onChange={handleClassNumberChange}
					/>
					<select
						className={standartStyles.selectRegular}
						onChange={handleClassLetterChange}>
						{classLetters &&
							classLetters.map((el, index) => (
								<option
									key={index}
									value={el}>
									{el}
								</option>
							))}
					</select>
				</div>
			</div> */}
			<TeacherSchedule
				week={week}
				onUpdate={handleUpdate}
                userRole={userRole}
                teacher={teacher}
			/>
		</div>
	);
}
