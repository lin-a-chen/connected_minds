"use client";

import { useState, useEffect } from "react";
import styles from "./Homeworks.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import AutocompleteInput from "@/components/UI/AutocompleteInput";
import Loading from "@/components/modals/Loading";
import { LuCross } from "react-icons/lu";
import NothingToShow from "@/components/modals/NothingToShow";
import AddHomework from "@/components/modals/AddHomework";
import HomeworkBlock from "./HomeworkBlock";

export default function SchoolchildHomeworks({ user, userRole }) {
	const [subjects, setSubjects] = useState([]);
	const [subject, setSubject] = useState("Природознавство");
	const [homeworks, setHomeworks] = useState([]);
	const [openAddHomework, setOpenAddHomework] = useState(false);
	const [schoolchild, setSchoolchild] = useState(null);

	const handleOnChangeSubject = (value) => {
		if (value) {
			setSubject(value);
		}
	};

	const fetchSubjects = async () => {
		const response = await fetch(`/api/institution/subjects`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const formatted = [];

		result.data.forEach((el) => {
			if (el.classes_type === schoolchild.classes_type) {
				formatted.push(el.name);
			}
		});
		setSubjects(formatted);
	};

	const fetchSchoolchild = async () => {
		const response = await fetch(
			`/api/institution/schoolchildren?user-id=${user.id}`
		);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		setSchoolchild(result.data);
	};

	const fetchHomework = async () => {
		if (subject) {
			const response = await fetch(
				`/api/institution/homework?class=${schoolchild.class_name}&subject=${subject}`
			);
			const result = await response.json();
			if (!result.success) {
				console.error(result.data);
			}

			setHomeworks(result.data);
		}
	};

	useEffect(() => {
		fetchSchoolchild();
	}, []);

	useEffect(() => {
		if (schoolchild) {
			fetchSubjects();
		}
	}, [schoolchild]);

	useEffect(() => {
		if (schoolchild && subject) {
			fetchHomework();
		}
	}, [schoolchild, subject]);

	useEffect(() => {}, [homeworks]);

	return (
		<div className={styles.page}>
			{(!subjects || !subject || !homeworks) && <Loading />}
			{subjects && (
				<div className={styles.header}>
					<div>
						<label>Предмет*</label>
						<AutocompleteInput
							dataToSearch={subjects}
							onChange={handleOnChangeSubject}
							defaultValue={subject ? subject : "Природознавство"}
						/>
					</div>
				</div>
			)}
			{subject && subject.length > 0 && (
				<div className={styles.homeworks}>
					{homeworks &&
						homeworks.length > 0 &&
						homeworks.map((el) => (
							<HomeworkBlock
								key={el.id}
								user={user}
								userRole={userRole}
								homework={el}
							/>
						))}
					{!homeworks && <Loading />}
				</div>
			)}
			{!homeworks && <Loading />}

			{homeworks.length <= 0 && (
				<NothingToShow
					imageSource={`images/nothing.png`}
					message={"Сюди ще не додавали домашнє завдання або воно завантажується"}
				/>
			)}
		</div>
	);
}
