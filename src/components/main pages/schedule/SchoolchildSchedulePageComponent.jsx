"use client";

import Schedule from "@/components/main pages/schedule/Schedule";
import { useEffect, useState } from "react";
import styles from "./SchedulePage.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import SchoolchildSchedule from "@/components/main pages/schedule/SchoolchildSchedule";

export default function SchoolchildSchedulePageComponent({userRole, user}) {
	const [week, setWeek] = useState([]);
	const [schoolchild, setSchoolchild] = useState(null);

    useEffect(() => {
		const fetchSchoolchild = async () => {
			const response = await fetch(
				`/api/institution/schoolchildren?user-id=${user.id}`
			);

			const result = await response.json();

			if (!result.success) {
				console.error("Couldn't get teacher");
			}

			setSchoolchild(result.data);
		};

		fetchSchoolchild();
	}, []);

	const handleUpdate = () => {
		fetchSchedule();
	};

	const fetchSchedule = async () => {
		const response = await fetch(`/api/institution/schedule?class=${schoolchild.class_name}`);
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
		if (schoolchild){
			fetchSchedule();
		}
	}, [schoolchild]);

	return (
		<div className={styles.schedulePage}>
			<SchoolchildSchedule
				week={week}
				onUpdate={handleUpdate}
                userRole={userRole}
                schoolchild={schoolchild}
			/>
		</div>
	);
}
