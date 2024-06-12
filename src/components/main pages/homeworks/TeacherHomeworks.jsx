"use client";

import { useState, useEffect } from "react";
import styles from "./Homeworks.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import AutocompleteInput from "@/components/UI/AutocompleteInput";
import Loading from "@/components/modals/Loading";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LuClock2, LuCross, LuTrash2 } from "react-icons/lu";
import NothingToShow from "@/components/modals/NothingToShow";
import AddHomework from "@/components/modals/AddHomework";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import HomeworkBlock from "./HomeworkBlock";

export default function TeacherHomeworks({ user, userRole }) {
	const [className, setClassName] = useState({ number: 1, letter: "А" });
	const [subjects, setSubjects] = useState([]);
	const [subject, setSubject] = useState("Природознавство");
	const [classObj, setClassObj] = useState({});
	const [classLetters, setClassLetters] = useState([]);
	const [homeworks, setHomeworks] = useState([]);
	const [openAddHomework, setOpenAddHomework] = useState(false);


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

	const handleOnChangeSubject = (value) => {
		if (value) {
			setSubject(value);
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

	const fetchSubjects = async () => {
		const response = await fetch(`/api/institution/subjects`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const formatted = [];

		if (classObj) {
			result.data.forEach((el) => {
				if (el.classes_type === classObj.type) {
					formatted.push(el.name);
				}
			});
			setSubjects(formatted);
		} else {
			setSubjects(result.data);
		}
	};

	const fetchClass = async () => {
		if (className) {
			const response = await fetch(
				`/api/institution/classes?class=${className.number}-${className.letter}`
			);
			const result = await response.json();
			if (!result.success) {
				console.error(result.data);
			}

			setClassObj(result.data);
		}
	};

	const fetchHomework = async () => {
		if (className && subject) {
			const response = await fetch(
				`/api/institution/homework?class=${className.number}-${className.letter}&subject=${subject}`
			);
			const result = await response.json();
			if (!result.success) {
				console.error(result.data);
			}

			setHomeworks(result.data);
		}
	};

	useEffect(() => {
		fetchClass();
	}, [className.letter, className.number]);

	useEffect(() => {
		fetchClasses();
	}, []);

	useEffect(() => {
		fetchSubjects();
	}, [classObj]);

	useEffect(() => {
		fetchHomework();
	}, [classObj, subject]);

	useEffect(() => {}, [homeworks]);

	const handleCloseAddHomework = () => {
		setOpenAddHomework(false);
		fetchHomework();
	};

	const handleUpdate = () => {
        fetchHomework();
    }

	return (
		<div className={styles.page}>
			{
				<AddHomework
					user={user}
					classLetters={classLetters}
					subjects={subjects}
					isVisible={openAddHomework}
					onClose={handleCloseAddHomework}
				/>
			}
			{(!subjects ||
				!classLetters ||
				!subject ||
				!homeworks ||
				!classObj) && <Loading />}
			{subjects && (
				<div className={styles.header}>
					<div>
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
					</div>

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
			<button
				onClick={() => setOpenAddHomework(true)}
				className={styles.buttonAddHomework}>
				<LuCross />
				Додати домашнє завдання
			</button>
			{subject && subject.length > 0 && (
				<div className={styles.homeworks}>
					{homeworks &&
						homeworks.length > 0 &&
						homeworks.map((el) => (
							<HomeworkBlock key={el.id} onUpdate={handleUpdate} user={user} userRole={userRole} homework={el}/>
						))}
					{!homeworks && <Loading />}
				</div>
			)}
			{!homeworks && <Loading />}

			{homeworks.length <= 0 && (
				<NothingToShow
					imageSource={`images/nothing.png`}
					message={"Сюди ще не додавали домашнє завдання"}
				/>
			)}
		</div>
	);
}
