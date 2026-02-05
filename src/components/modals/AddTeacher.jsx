import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { LuMail, LuPhone } from "react-icons/lu";
import { TbCalendar, TbPencilMinus, TbBuildingEstate, TbBriefcase } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import { useState, useEffect } from "react";
import AutocompleteInput from "../UI/AutocompleteInput";

export default function AddTeacher({ onClose, isVisible }) {
	const [region, setRegion] = useState(null);
	const [regions, setRegions] = useState([]);
	const [settlements, setSettlements] = useState([]);
	const [institution, setInstitution] = useState({});

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
	} = useForm();

	const today = new Date();
	const minDate = new Date(
		today.getFullYear() - 19,
		today.getMonth(),
		today.getDate()
	)
		.toISOString()
		.split("T")[0];

	const onSubmit = async (data) => {
		const validateResponse = await fetch(
			`/api/institution/teachers/validate`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);
		const validateResult = await validateResponse.json();

		if (!validateResult.success) {
			toast.error(validateResult.data);
			return;
		}

		const response = await fetch(`/api/institution/teachers`, {
			method: "POST",
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
			onClose();
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

	return (
		<>
			{isVisible && (
				<div className={`${styles.popupBackdrop} ${styles.noBlur}`}>
					<div
						className={`${styles.popupWindow} ${styles.errorPopup}`}>
						<form className={standartStyles.form}>
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
									defaultValue="Марія"
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
									defaultValue="Марієнко"
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
									defaultValue="Маріївна"
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
									defaultValue="maria.marchenko@mail.com"
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
									defaultValue={"+38(073)333-45-21"}
									type="tel"
									className={`${standartStyles.inputRegular}`}
									placeholder="+38(067)9998877"
									{...register("phoneNumber", {
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
									<MdOutlinePassword
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Пароль*
									</label>
								</div>
								<input
									className={`${standartStyles.inputRegular}`}
									type="password"
									{...register("password", {
										required: "Ви пропустили пароль",
										minLength: {
											value: 8,
											message:
												"Пароль не може бути коротшим за 8 символів",
										},
										validate: {
											hasUpperCase: (value) =>
												/[A-Z]/.test(value) ||
												"Пароль повинен містити хоч одну велику літеру",
											hasLowerCase: (value) =>
												/[a-z]/.test(value) ||
												"Пароль повинен містити хоч одну маленьку літеру",
											hasNumber: (value) =>
												/\d/.test(value) ||
												"Пароль повинен містити хоч одну цифру",
											hasSpecialChar: (value) =>
												/[!@#$%^&*]/.test(value) ||
												"Пароль повинен містити хоч один спеціальний символ",
										},
									})}
								/>
								{errors.password && (
									<span className={styles.errorMessage}>
										{errors.password.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<MdOutlinePassword
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Повторіть пароль*
									</label>
								</div>
								<input
									className={`${standartStyles.inputRegular}`}
									type="password"
									{...register("repeatPassword", {
										required: "Повторіть пароль",
										validate: (value) =>
											value === watch("password") ||
											"Паролі не співпадають",
									})}
								/>
								{errors.repeatPassword && (
									<span className={styles.errorMessage}>
										{errors.repeatPassword.message}
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
									defaultValue={"Вчитель математики старших класів"}
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
									{...register("birthdate", {
										required:
											"Дата народження не може бути пустою",
										validate: {
											validAgeRange: (value) => {
												return (
													(value <= minDate) ||
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
									defaultValue={"Україна"}
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
										<option value="">Оберіть регіон</option>
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
										defaultValue={"Житомирська область"}
										className={`${standartStyles.inputRegular}`}
										placeholder="Житомирська область"
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
													: null
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
									defaultValue={"вулиця Якась"}
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
									className={standartStyles.buttonSubmit}
									type="submit"
									onClick={handleSubmit(onSubmit)}
									label="Увійти">
									Зареєструвати
								</button>
								<button
									className={styles.cancel}
									onClick={onClose}>
									Відхилити
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
