"use client";

import { useEffect, useState } from "react";
import styles from "./SchedulePage.module.scss";
import TeacherSchedule from "@/components/main pages/schedule/TeacherSchedule";

export default function TeacherSchedulePageComponent({userRole, user}) {
	const [week, setWeek] = useState([]);
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
		const response = await fetch(`/api/institution/schedule`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
			return;
		}
	
		const groupedByWeekday = result.data.reduce((acc, current) => {
			const { weekday } = current;
			if (!acc[weekday]) {
				acc[weekday] = [];
			}
			acc[weekday].push(current);
			return acc;
		}, {});
	
		const sortedWeekdays = Array.from({ length: 6 }, (_, i) => {
			return groupedByWeekday[i] || [{ weekday: i }];
		});
	
		setWeek(sortedWeekdays);
	};

	useEffect(() => {
		fetchSchedule();
	}, []);

	return (
		<div className={styles.schedulePage}>
			{teacher && week && <TeacherSchedule
				week={week}
				onUpdate={handleUpdate}
                userRole={userRole}
                teacher={teacher}
			/>}
		</div>
	);
}
