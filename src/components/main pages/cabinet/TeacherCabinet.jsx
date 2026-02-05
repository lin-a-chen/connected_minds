"use client";

import styles from "./Cabinet.module.scss";
import { SiGoogleclassroom } from "react-icons/si";
import { LuCalendarDays } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { LuPencil } from "react-icons/lu";
import standartStyles from "@/styles/Styles.module.scss";
import { LuMail, LuPhone } from "react-icons/lu";
import {
	TbCalendar,
	TbPencilMinus,
	TbBuildingEstate,
	TbBriefcase,
} from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import AutocompleteInput from "@/components/UI/AutocompleteInput";
import Loading from "@/components/modals/Loading";
import ChangePassword from "./ChangePassword";

export default function TeacherCabinet({ user }) {
	const [teacher, setTeacher] = useState(null);
	const [editPhotoRequestStarted, setEditPhotoRequestStarted] =
		useState(false);
	const [region, setRegion] = useState(null);
	const [regions, setRegions] = useState([]);
	const [settlements, setSettlements] = useState([]);
	const [institution, setInstitution] = useState({});
	const [userPhoto, setUserPhoto] = useState(null);
	const formRef = useRef(null);

	const handleFileUpload = async (e) => {
		e.preventDefault();

		if (user && !editPhotoRequestStarted) {
			const formData = new FormData(formRef.current);
			formData.append("file", formRef.current.file.files[0]);
			formData.append("userId", user.id);
			try {
				setEditPhotoRequestStarted(true);

				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();
				setEditPhotoRequestStarted(false);

				if (!result.success) {
					console.error(result.data);
					toast.error("Не вийшло завантажити фото");
				} else {
					setUserPhoto(result.data);
					toast.success("Фото успішно змінено");
				}
			} catch (error) {
				setEditPhotoRequestStarted(false);
				console.error("Error uploading image:", error);
				toast.error("Не вийшло завантажити фото");
			}
		}
	};

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

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
		setValue,
	} = useForm({});

	useEffect(() => {
		if (teacher) {
			setValue("firstname", teacher.firstname);
			setValue("lastname", teacher.lastname);
			setValue("antroponym", teacher.antroponym);
			setValue(
				"birthdate",
				new Date(teacher.birthdate).toISOString().slice(0, 10)
			);
			setValue("country", teacher.country);
			setValue("region", teacher.region);
			setValue("settlement", teacher.settlement);
			setValue("address", teacher.address);
			setValue("position", teacher.position);
		}
	}, [teacher, setValue]);

	const today = new Date();
	const minDate = new Date(
		today.getFullYear() - 19,
		today.getMonth(),
		today.getDate()
	)
		.toISOString()
		.split("T")[0];

	const onSubmit = async (data) => {
		const response = await fetch(`/api/institution/teachers`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...data,
				institutionUseedCode: institution.useed_code,
			}),
		});
		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		} else {
			toast.success("Дані успішно оновлено");
		}
	};

	const fetchRegions = async () => {
		const response = await fetch(`/api/settlements`, { method: "GET" });
		const result = await response.json();
		if (result.success) {
			setRegions(result.data);
		} else {
			console.error(result.data);
		}
	};

	const fetchInstitution = async () => {
		const response = await fetch(`/api/institution`, { method: "GET" });
		const result = await response.json();
		if (result.success) {
			setInstitution(result.data);
		} else {
			console.error(result.data);
		}
	};

	const handleRegionSelection = (e) => {
		setRegion(e.target.value);
	};

	useEffect(() => {
		fetchRegions();
		fetchInstitution();
	}, []);

	useEffect(() => {
		if (region) {
			const fetchSettlements = async () => {
				const response = await fetch(
					`/api/settlements?region=${region}`
				);
				const result = await response.json();
				if (result.success) {
					const settlements = result.data.map(
						(el) => `${el.category} ${el.name} (${el.district})`
					);
					setSettlements(settlements);
				} else {
					console.error(result.data);
				}
			};
			fetchSettlements();
		}
	}, [region]);

	useEffect(() => {}, [userPhoto]);

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div className={styles.profilePictureBlock}>
					<div className={styles.profilePicture}>
						<img
							src={
								userPhoto
									? userPhoto
									: user.photo
									? user.photo
									: "/images/teacher.png"
							}
						/>
					</div>
					<form
						ref={formRef}
						onSubmit={handleFileUpload}
						encType="multipart/form-data"
						className={styles.buttonChangeProfile}>
						<label>
							{!editPhotoRequestStarted && (
								<>
									<input
										name="file"
										type="file"
										onChange={handleFileUpload}
									/>
									<LuPencil />
								</>
							)}
							{editPhotoRequestStarted && (
								<span className={styles.loader}></span>
							)}
						</label>
					</form>
				</div>

				<p>{teacher && `${teacher.firstname} ${teacher.lastname}`}</p>
				<div className={styles.widgets}>
					<div>
						<a href="/cabinet/teacher/classes">
							<SiGoogleclassroom />
						</a>
					</div>
					<div>
						<a href="/cabinet/teacher/schedule">
							<LuCalendarDays />
						</a>
					</div>
				</div>
			</div>

			{user && teacher && (
				<>
					<div className={styles.personalInfo}>
						<form className={standartStyles.form}>
							<p>Змінити особисту інформацію</p>
							<fieldset>
								<div>
									<div className={standartStyles.icon}>
										<TbPencilMinus />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Ім'я*
									</label>
								</div>
								<input
									defaultValue={teacher && teacher.firstname}
									placeholder="Марія"
									{...register("firstname", {
										required: "Ім'я не може бути пустим",
									})}
								/>
								{errors.firstname && (
									<span className={styles.errorMessage}>
										{errors.firstname.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<div className={standartStyles.icon}>
										<TbPencilMinus />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Прізвище*
									</label>
								</div>
								<input
									defaultValue={teacher && teacher.lastname}
									placeholder="Марієнко"
									{...register("lastname", {
										required:
											"Прізвище не може бути пустим",
									})}
								/>
								{errors.lastname && (
									<span className={styles.errorMessage}>
										{errors.lastname.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<div className={standartStyles.icon}>
										<TbPencilMinus />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										По-батькові або по-матері*
									</label>
								</div>
								<input
									defaultValue={teacher && teacher.antroponym}
									placeholder="Маріївна"
									{...register("antroponym", {
										required:
											"По матері чи по батькові не може бути пустим",
									})}
								/>
								{errors.antroponym && (
									<span className={styles.errorMessage}>
										{errors.antroponym.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<LuMail className={standartStyles.icon} />
									<label>Email*</label>
								</div>
								<input
									defaultValue={user && user.email}
									type="email"
									placeholder="maria.marienko@mail.com"
									{...register("email", {
										required: "Логін обов'язковий",
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
											message: "Формат email невірний",
										},
									})}
								/>
								{errors.email && (
									<span
										className={standartStyles.errorMessage}>
										{errors.email.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<LuPhone className={styles.icon} />
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Телефон*
									</label>
								</div>
								<input
									defaultValue={user && user.phone_number}
									type="tel"
									className={`${standartStyles.inputRegular}`}
									placeholder="+38(067)9998877"
									{...register("phone_number", {
										required:
											"Ви пропустили номер телефону",
										pattern: {
											value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
											message: "Формат номеру невірний",
										},
									})}
								/>
								{errors.phoneNumber && (
									<span className={styles.errorMessage}>
										{errors.phoneNumber.message}
									</span>
								)}
							</fieldset>

							<fieldset>
								<div>
									<TbBriefcase className={styles.icon} />
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Посада*
									</label>
								</div>
								<input
									type="text"
									defaultValue={teacher && teacher.position}
									className={`${standartStyles.inputRegular}`}
									placeholder="Вчитель математики старших класів"
									{...register("position", {
										required: "Посада обов'язкова",
									})}
								/>
								{errors.position && (
									<span className={styles.errorMessage}>
										{errors.position.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<TbCalendar className={styles.icon} />
									<label>Дата народження*</label>
								</div>
								<input
									type="date"
									placeholder="01/01/1970"
									defaultValue={
										teacher && teacher.birthdate
											? new Date(teacher.birthdate)
													.toISOString()
													.slice(0, 10)
											: ""
									}
									{...register("birthdate", {
										required:
											"Дата народження не може бути пустою",
										validate: {
											validAgeRange: (value) => {
												return (
													new Date(value) <=
														new Date(minDate) ||
													`Вам має бути 18 або більше років`
												);
											},
										},
									})}
								/>
								{errors.birthdate && (
									<span className={styles.errorMessage}>
										{errors.birthdate.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<MdOutlineAddLocationAlt
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Країна*
									</label>
								</div>
								<input
									type="text"
									defaultValue={teacher && teacher.country}
									className={`${standartStyles.inputRegular}`}
									placeholder="Україна"
									{...register("country", {
										required: "Країна обов'язкова",
									})}
								/>
								{errors.country && (
									<span className={styles.errorMessage}>
										{errors.country.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<MdOutlineAddLocationAlt
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Область чи інший регіон*
									</label>
								</div>
								{watch().country === "Україна" ? (
									<select
										className={`${standartStyles.selectRegular}`}
										{...register("region", {
											required:
												"Область чи регіон обов'язкові",
										})}
										onChange={handleRegionSelection}>
										<option
											value={
												teacher ? teacher.region : ""
											}>
											{teacher
												? teacher.region
												: "Оберіть область"}
										</option>
										{regions &&
											regions.map((el, index) => (
												<option
													key={index}
													value={el}>
													{el}
												</option>
											))}
									</select>
								) : (
									<input
										type="text"
										defaultValue={teacher && teacher.region}
										className={`${standartStyles.inputRegular}`}
										placeholder="Баварія"
										{...register("region", {
											required:
												"Область чи інший регіон обов'язковий",
										})}
									/>
								)}
								{errors.region && (
									<span
										className={standartStyles.errorMessage}>
										{errors.region.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<MdOutlineAddLocationAlt
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Населений пункт*
									</label>
								</div>
								<Controller
									name="settlement"
									control={control}
									rules={{
										required:
											"Населений пункт не може бути пустим",
									}}
									render={({
										field: { onChange, value },
									}) => (
										<AutocompleteInput
											dataToSearch={settlements}
											value={value}
											onChange={onChange}
											defaultValue={
												watch().settlement
													? watch().settlement
													: teacher
													? teacher.settlement
													: ""
											}
										/>
									)}
								/>
								{errors.settlement && (
									<span
										className={standartStyles.errorMessage}>
										{errors.settlement.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<TbBuildingEstate className={styles.icon} />
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Адреса*
									</label>
								</div>
								<input
									type="text"
									defaultValue={teacher && teacher.address}
									className={`${standartStyles.inputRegular}`}
									placeholder="вул. Вишнева, буд. 131а/б"
									{...register("address", {
										required: "Адреса обов'язкова",
									})}
								/>
								{errors.address && (
									<span className={styles.errorMessage}>
										{errors.address.message}
									</span>
								)}
							</fieldset>
							<div className={styles.buttons}>
								<button
									className={standartStyles.buttonRegular}
									type="submit"
									onClick={handleSubmit(onSubmit)}>
									Зберегти
								</button>
							</div>
						</form>
						{<ChangePassword user={user} />}
					</div>
				</>
			)}
			{(!teacher || !user) && <Loading />}
		</div>
	);
}
