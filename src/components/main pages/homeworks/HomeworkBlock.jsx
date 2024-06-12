"use client";
import { useState, useEffect } from "react";
import styles from "./Homeworks.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import Loading from "@/components/modals/Loading";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LuClock2, LuCross, LuTrash2 } from "react-icons/lu";
import { TbPencilMinus, TbCheck } from "react-icons/tb";
import { IoIosClose } from "react-icons/io";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function HomeworkBlock({ user, userRole, homework, onUpdate }) {
	const [isEditing, setIsEditing] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
		setValue,
	} = useForm();

	const handleDelete = async (e) => {
		e.preventDefault();
		const response = await fetch(
			`/api/institution/homework?id=${homework.id}`,
			{ method: "DELETE" }
		);
		const result = await response.json();

		if (!result.success) {
			console.error(result.data);
			toast.error("Не вдалося видалити домашнє завдання");
			return;
		}

		toast.success("Домашню роботу успішно видалено");
		onUpdate();
	};

	const onSubmit = async (data) => {
		// e.preventDefault();
		if (isEditing) {

			const response = await fetch(`/api/institution/homework`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...data,
					teacherId: homework.teacher_id,
					subjectId: homework.subject_id,
					classId: homework.class_id,
					id: homework.id,
				}),
			});

			const result = await response.json();

			if (!result.success) {
				console.error(result.data);
				toast.error("Не вдалося змінити домашнє завдання");
				return;
			}

			toast.success("Домашню роботу успішно змінено");
			setIsEditing(false);
			onUpdate();
		}
	};

	// const handleDownload = async (fileUrl) => {
	// 	try {
	// 		const response = await fetch(`/api/download?url=${encodeURIComponent(fileUrl)}`);
	// 		if (!response.ok) {
	// 			console.error('Failed to fetch file:', response.statusText);
	// 			return;
	// 		}
	
	// 		const blob = await response.blob();
	// 		const url = window.URL.createObjectURL(blob);
	// 		const link = document.createElement('a');
	// 		link.href = url;
	// 		const fileName = fileUrl.split('/').pop(); // Extract the file name
	// 		link.setAttribute('download', fileName);
	// 		document.body.appendChild(link);
	// 		link.click();
	// 		document.body.removeChild(link);
	// 	} catch (error) {
	// 		console.error('Error downloading file:', error);
	// 	}
	// };
	

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={styles.homework}>
			<div className={styles.homeworkHeader}>
				<p className={styles.subjectName}>{homework.subject_name}</p>
				{userRole === "TEACHER" && !isEditing && (
					<div className={styles.buttons}>
						<button
							className={`${standartStyles.buttonEdit} ${standartStyles.buttonIconNoText}`}
							onClick={() => setIsEditing(true)}>
							<TbPencilMinus />
						</button>
						<button
							type="button"
							className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
							onClick={handleDelete}>
							<LuTrash2 />
						</button>
					</div>
				)}
				{userRole === "TEACHER" && isEditing && (
					<div className={styles.buttons}>
						<button
							disabled={
								errors.deadline || errors.description
									? true
									: false
							}
							type="submit"
							className={`${standartStyles.buttonSave} ${standartStyles.buttonIconNoText}`}>
							<TbCheck />
						</button>
						<button
							className={`${standartStyles.buttonDelete} ${standartStyles.buttonIconNoText}`}
							onClick={() => setIsEditing(false)}>
							<IoIosClose />
						</button>
					</div>
				)}
			</div>

			<div className={styles.details}>
				<p className={!isEditing && ` ${styles.deadline}`}>
					<LuClock2 />
					{isEditing ? (
						<>
							<input
								type="date"
								className={standartStyles.inputRegular}
								{...register("deadline", {
									required: "Це поле обов'язкове",
								})}
								defaultValue={
									homework && homework.deadline
										? new Date(homework.deadline)
												.toISOString()
												.slice(0, 10)
										: ""
								}
							/>
							{errors.deadline && (
								<span className={styles.errorMessage}>
									{errors.deadline.message}
								</span>
							)}
						</>
					) : (
						<span>{`
                                    ${new Date(
										new Date(homework.deadline).setDate(
											new Date(
												homework.deadline
											).getDate() + 1
										)
									)
										.toISOString()
										.slice(0, 10)}
                                `}</span>
					)}
				</p>

				<div className={styles.teacherFullname}>
					<FaChalkboardTeacher />
					<a
						href={`/api/institution/teacher/${homework.teacher_id}`}>{`${homework.teacher_lastname} ${homework.teacher_firstname[0]}.${homework.teacher_antroponym[0]}.`}</a>
				</div>
			</div>
			<div className={styles.description}>
				{isEditing ? (
					<>
						<textarea
							className={styles.description}
							defaultValue={homework.description}
							{...register("description", {
								required: "Це поле обов'язкове",
							})}
						/>
						{errors.description && (
							<span className={styles.errorMessage}>
								{errors.description.message}
							</span>
						)}
					</>
				) : (
					homework.description
				)}
			</div>

			{/* <div className={styles.description}>
				{isEditing ? (
					<>
						<input
							name="file"
							type="file"
							onChange={handleFileUpload}
							{...register("file", {
								required: false,
							})}
						/>

						{errors.file && (
							<span className={styles.errorMessage}>
								{errors.file.message}
							</span>
						)}
					</>
				) : (
					<>
					{/* <a href={homework.fileUrl} target="_blank" rel="noopener noreferrer">Переглянути файл</a> */}
					{/* <button onClick={() => handleDownload(homework.fileUrl)}>Завантажити файл</button></> */}
					
				{/* )} */}
			{/* </div> */} 
		</form>
	);
}
