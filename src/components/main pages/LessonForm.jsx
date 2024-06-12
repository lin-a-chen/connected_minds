// src/components/LessonForm.js
import React, { useState, useEffect } from "react";
import styles from "./LessonForm.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { useForm, Controller } from "react-hook-form";
import { LuCross } from "react-icons/lu";
import AutocompleteInput from "../UI/AutocompleteInput";
import { toast } from "react-toastify";

export default function LessonForm({ day, onAddLesson }) {
	const [subjects, setSubjects] = useState([]);
	const [classesType, setClassesType] = useState(null);

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		control,
		handleSubmit,
		reset,
	} = useForm({});

	const submitLesson = async (data) => {
		const response = await fetch(
			`/api/institution/schedule/lesson`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					classesType: classesType,
					scheduleId: day[0].schedule_id,
				}),
			}
		);

		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		}
		toast.success('Урок успішно додано у розклад');
		onAddLesson();
	};

	const fetchSubjects = async () => {
		const classResponse = await fetch(
			`/api/institution/classes?id=${day[0].class_id}`
		);
		const classResult = await classResponse.json();
		if (!classResult.success) {
			console.error(classResult.data);
			return;
		}

		const subjectsResponse = await fetch(`/api/institution/subjects`);
		const subjectsResult = await subjectsResponse.json();
		if (!subjectsResult.success) {
			console.error(subjectsResult.data);
			return;
		}

		const formatted = [];
		subjectsResult.data.forEach((el) => {
			if (el.classes_type === classResult.data.type) {
				formatted.push(el.name);
			}
		});
		setSubjects(formatted);
		setClassesType(classResult.data.type);
	};

	useEffect(() => {
		fetchSubjects();
	}, []);

	return (
		<form
			onSubmit={handleSubmit(submitLesson)}
			className={`${styles.form}`}>
			<fieldset>
				<label>Час початку*</label>
				<input
					type="time"
					min={`08:30`}
					max={`15:05`}
					className={`${standartStyles.inputRegular}`}
					{...register("subjectStartTime", {
						required: "Час не може бути пустим",
					})}
				/>
				<label>Час закінчення*</label>
				<input
					type="time"
					min={`09:15`}
					max={`16:00`}
					className={`${standartStyles.inputRegular}`}
					{...register("subjectEndTime", {
						required: "Час не може бути пустим",
					})}
				/>
				{(errors.subjectStartTime || errors.subjectEndTime) && (
					<span className={standartStyles.errorMessage}>
						{errors.subjectStartTime.message}
					</span>
				)}
			</fieldset>
			<fieldset>
				<label>Назва предмету*</label>
				<Controller
					name="subjectName"
					control={control}
					render={({ field: { onChange, value } }) => (
						<AutocompleteInput
							dataToSearch={subjects}
							value={value}
							onChange={onChange}
							defaultValue={
								watch().subjectName ? watch().subjectName : null
							}
						/>
					)}
				/>
				{errors.subjectName && (
					<span className={standartStyles.errorMessage}>
						{errors.subjectName.message}
					</span>
				)}
				<label>Email викладача*</label>
				<input
					className={standartStyles.inputRegular}
					type="email"
					name="teachersEmail"
					{...register("teachersEmail", {
						required: "Введіть email вчителя/вчительки",
						pattern: {
							value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
							message: "Формат email невірний",
						},
					})}
				/>
				{errors.teachersEmail && (
					<span className={standartStyles.errorMessage}>
						{errors.teachersEmail.message}
					</span>
				)}
			</fieldset>
			<button
				className={styles.buttonAdd}
				type="submit">
				<LuCross />
			</button>
		</form>
	);
}
