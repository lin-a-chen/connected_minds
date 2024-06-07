"use client";

import Schedule from "@/components/main pages/Schedule";
import { useEffect, useState } from "react";
import styles from "./SchedulePage.module.scss";

export default function SchedulePage() {
	const [week, setWeek] = useState([]);
	const [className, setClassName] = useState({ number: 1, letter: "А" });
	const [classLetters, setClassLetters] = useState([]);

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
			  
			console.log('sortedWeekdays', sortedWeekdays);
			setWeek(sortedWeekdays);
		}
	};

	// const fetchSubject = async () => {
	// 	const response = await fetch(
	// 		`/api/institution/schedule?class=${className.number}-${className.letter}`
	// 	);
	// 	const result = await response.json();
	// 	if (!result.success) {
	// 		console.error(result.data);
	// 	} else {
	// 		setWeek(result.data);
	// 	}
	// };

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

	const handleClassNumberChange = (e) => {
		setClassName((prev) => ({
			...prev,
			number: +e.target.value,
		}));
	};

	const handleClassLetterChange = (e) => {
		setClassName((prev) => ({
			...prev,
			letter: e.target.value,
		}));
	};

	useEffect(() => {
		fetchSchedule();
	}, [className]);

	return (
		<div className={styles.schedulePage}>
			<div className={styles.header}>
				<label>Клас*</label>
				<div>
					<input
						defaultValue="8"
						type="number"
						min="1"
						max="11"
						placeholder="1"
						onChange={handleClassNumberChange}
					/>
					<select onChange={handleClassLetterChange}>
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
			</div>
			<Schedule week={week} />
		</div>
	);
}
