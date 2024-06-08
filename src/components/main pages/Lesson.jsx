import React, { useEffect, useState } from "react";
import styles from "./Lesson.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { LuTrash2, LuCross } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { FaChalkboardTeacher } from "react-icons/fa";
import AutocompleteInput from "../UI/AutocompleteInput";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-toastify";

export default function Lesson({ lesson, onUpdate, onDelete }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedLesson, setEditedLesson] = useState(lesson);
	const [subjects, setSubjects] = useState([]);

	const {
		register,
		handleSubmit,
		watch,
		setError,
		control,
		formState: { errors },
	} = useForm();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setEditedLesson({ ...editedLesson, [name]: value });
	};

	const handleSave = () => {
		// onUpdate(editedLesson);
		setIsEditing(false);
		onUpdate();
	};

	const handleEdit = () => {
		setIsEditing(true);
	};

	const fetchSubjects = async () => {
		const response = await fetch(`/api/institution/subjects`);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
		}

		const formatted = [];
		result.data.forEach((el) => {
			if (el.classes_type === lesson.classes_type) {
				formatted.push(el.name);
			}
		});
		console.log("formatted", formatted);
		setSubjects(formatted);
	};

	useEffect(() => {
		fetchSubjects();
	}, []);

	const submitionHandler = async (data) => {
		if (!data.subject_name) {
			setError("subject_name", {
				type: "manual",
				message: "Введіть назву предмету",
			});
			return;
		}

		console.log('submit!')

		const response = await fetch(`/api/institution/schedule/lesson`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...data,
				lesson_id: lesson.lesson_id,
				schedule_id: lesson.schedule_id,
				classes_type: lesson.classes_type,
			}),
		});

		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
		}

		onUpdate();
	};

	const handleDelete = async () => {
		const response = await fetch(`/api/institution/schedule/lesson`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: lesson.lesson_id,
			}),
		});

		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
		}

		onUpdate();
	}

	return (
		<form
			onSubmit={handleSubmit(submitionHandler)}
			className={styles.lessonRow}>
			{isEditing ? (
				<>
					<fieldset className={styles.subjectTime}>
						<input
							className={`${standartStyles.inputRegular}
              ${styles.subjectTime}`}
							type="time"
							name="start_time"
							defaultValue={editedLesson.start_time}
							onChange={handleChange}
							{...register("start_time", {
								required: "Час не може бути пустим",
							})}
						/>
						{errors.start_time && (
							<span className={standartStyles.errorMessage}>
								{errors.start_time.message}
							</span>
						)}
						<input
							className={`${standartStyles.inputRegular}
              ${styles.subjectTime}`}
							type="time"
							name="end_time"
							defaultValue={editedLesson.end_time}
							onChange={handleChange}
							{...register("end_time", {
								required: "Час не може бути пустим",
							})}
						/>
						{errors.end_time && (
							<span className={standartStyles.errorMessage}>
								{errors.end_time.message}
							</span>
						)}
					</fieldset>
					<fieldset className={styles.subjectText}>
						<Controller
							name="subject_name"
							control={control}
							render={({ field: { onChange, value } }) => (
								<AutocompleteInput
									dataToSearch={subjects}
									value={value}
									onChange={onChange}
									defaultValue={
										watch().subject_name
											? watch().subject_name
											: null
									}
								/>
							)}
						/>
						{errors.subject_name && (
							<span className={standartStyles.errorMessage}>
								{errors.subject_name.message}
							</span>
						)}
						<input
							className={standartStyles.inputRegular}
							type="email"
							name="teachers_email"
							defaultValue={editedLesson.teachers_email}
							onChange={handleChange}
							{...register("teachers_email", {
								required: "Введіть email вчителя/вчительки",
								pattern: {
									value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
									message: "Формат email невірний",
								},
							})}
						/>
						{errors.teachers_email && (
							<span className={standartStyles.errorMessage}>
								{errors.teachers_email.message}
							</span>
						)}
					</fieldset>
					<fieldset>
						{console.log('errors', errors.subject_name,
								errors.start_time,
								errors.end_time,
								errors.teachers_email)}
						<button
							disabled={
								errors.subject_name ||
								errors.start_time ||
								errors.end_time ||
								errors.teachers_email
									? true
									: false
							}
							type="submit"
							className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}
							onClick={handleSave}>
							<TbCheck />
						</button>
						<button
							className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
							onClick={() => setIsEditing(false)}>
							<IoIosClose />
						</button>
					</fieldset>
				</>
			) : (
				<>
					<fieldset className={`${styles.subjectTime}`}>
						<p>{lesson.start_time}</p>
						<div className={styles.dash}></div>
						<p>{lesson.end_time}</p>
					</fieldset>
					<fieldset className={styles.subjectText}>
						<p>
							<a>{lesson.subject_name}</a>
						</p>
						<div>
							<div className={styles.icon}>
								<FaChalkboardTeacher />
							</div>
							<a
								href={`/api/institution/teacher?id=${lesson.teachers_id}`}>{`${lesson.lastname} ${lesson.firstname[0]}.${lesson.antroponym[0]}.`}</a>
						</div>
					</fieldset>
					<fieldset>
						<button
							className={`${standartStyles.buttonEdit} ${standartStyles.buttonIconNoText}`}
							onClick={handleEdit}>
							<TbPencilMinus />
						</button>
						<button
							className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
							onClick={handleDelete}>
							<LuTrash2 />
						</button>
					</fieldset>
				</>
			)}
		</form>
	);
}
