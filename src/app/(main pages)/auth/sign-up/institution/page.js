"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import AutocompleteInput from "@/components/UI/AutocompleteInput/AutocompleteInput";
import { InfoPopup, ErrorPopup } from "@/components/modals/Popups";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//icons
import { LuMail, LuPhone } from "react-icons/lu";
import { MdOutlinePassword, MdOutlineAddLocationAlt } from "react-icons/md";
import {
	TbCodeAsterisk,
	TbLink,
	TbUserDollar,
	TbSchool,
	TbPencilMinus,
} from "react-icons/tb";

//styles
import authStyles from "@/styles/main pages/auth/Auth.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import multiStepFormStyles from "./MultiStepForm.module.scss";

export default function InstitutionMultiStepForm() {
	const [activeTab, setActiveTab] = useState(0);
	const [regions, setRegions] = useState([]);
	const [region, setRegion] = useState(null);
	const [settlements, setSettlements] = useState([]);
	const [institutionData, setInstitutionData] = useState({});
	const [showPopup, setShowPopup] = useState(false);

	const {
		register,
		watch,
		setValue,
		formState: { errors },
		control,
		handleSubmit,
		reset,
	} = useForm({ defaultValues: institutionData });

	const fetchRegions = async () => {
		const response = await fetch(`/api/settlements`, { method: "GET" });
		const result = await response.json();
		if (result.success) {
			setRegions(result.data);
		} else {
			console.error(result.data);
		}
	};

	const handleRegionSelection = (e) => {
		setRegion(e.target.value);
	};

	useEffect(() => {
		fetchRegions();
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

	const parseSettlement = (match) => {
		let settlementType;
		let settlementName;
		let district;
		if (match[1]) {
			switch (match[1].trim()) {
				case "с.":
					settlementType = "Село";
					break;
				case "с-ще":
					settlementType = "Селище";
					break;
				case "смт":
					settlementType = "смт";
					break;
				default:
					settlementType = "Місто";
					break;
			}
		} else settlementType = "Місто";

		if (match[2]) {
			settlementName = match[2].trim().toUpperCase();
		}
		if (match[3]) {
			district = match[3] ? match[3].toUpperCase() : "";
		} else district = null;

		const settlementParsed = settlements
			.map((el) => {
				if (
					!district &&
					el.toLowerCase().includes(settlementType.toLowerCase()) &&
					el.toLowerCase().includes(settlementName.toLowerCase())
				) {
					return el;
				} else if (
					el.toLowerCase().includes(settlementType.toLowerCase()) &&
					el.toLowerCase().includes(settlementName.toLowerCase()) &&
					el.toLowerCase().includes(district.toLowerCase())
				) {
					return el;
				} else return null;
			})
			.filter(Boolean);
		return settlementParsed;
	};

	const parseAdminUserFullname = (fullname) => {
		const regex =
			/([А-Яа-яЇїІіЄє\'\’\-]+)\s([А-Яа-яЇїІіЄє'’\-]+)\s([А-Яа-яЇїІіЄє\'\’\-]+)/g;
		const match = regex.exec(fullname);
		return {
			firstname: match[2],
			lastname: match[1],
			antroponym: match[3],
		};
	};

	useEffect(() => {
		const useedCode = parseInt(watch().useedCode);
		if (useedCode && useedCode > 100000) {
			const fetchInstitutionInfo = async () => {
				const response = await fetch(
					`/api/institutions?useed=${useedCode}`
				);
				const result = await response.json();
				if (result.success) {
					const data = result.data;

					if (result.data) {
						const institutionDataObj = {
							useedCode: data.useed_code,
							fullname: data.fullname,
							institutionType: data.institution_type,
							shortname: data.shortname,
							ownershipForm: data.ownership_form,
							coatsuuCode: data.coatsuu_code,
							region: data.region,
							settlement: data.settlement,
							address: data.address,
							governingBodyInChargeOfEducation:
								data.governing_body_in_charge_of_education,
							phoneNumber: data.phone_number,
							email: data.email,
							website: data.website,
							firstname: null,
							lastname: null,
							antroponym: null,
							adminUserId: data.admin_user_id,
						};
						setRegion(institutionDataObj.region);

						const unparsedSettlement = data.settlement;
						const regex =
							/(смт|с\.|с\-ще)?\s?([А-Яа-яЇїІіЄє'’\s\-]+)(?:\,?\s?([А-Яа-яЇїІіЄє'’\s\-]*\s?район)?)?(?:\,?\s?([А-Яа-яЇїІіЄє'’\s\-]*\s?область)?)?(?:\n)?/g;
						const match = regex.exec(unparsedSettlement);

						const {
							firstname: adminUserFirstname,
							lastname: adminUserLastname,
							antroponym: adminUserAntroponym,
						} = parseAdminUserFullname(data.admin_user_fullname);
						institutionDataObj.firstname = adminUserFirstname;
						institutionDataObj.lastname = adminUserLastname;
						institutionDataObj.antroponym = adminUserAntroponym;

						if (match) {
							const settlementParsed = parseSettlement(match);

							if (settlementParsed) {
								institutionDataObj.settlement =
									settlementParsed[0];
								setValue("settlement", settlementParsed);
								setInstitutionData(institutionDataObj);
								reset(institutionDataObj);
							} else {
								console.error(
									"Помилка парсингу населеного пункту"
								);
							}
						} else {
							console.error("Помилка парсингу населеного пункту");
						}
					} else {
						reset({});
					}
				} else {
					console.error(result.data);
				}
			};
			fetchInstitutionInfo();
		}
	}, [watch().useedCode, settlements]);

	const institutionTypes = [
		"вечірня (змінна) школа",
		"військовий (військово-морський, військово-спортивний) ліцей",
		"гімназія",
		"гімназія-інтернат",
		"колегіум",
		"ліцей",
		"ліцей з посиленою військово-фізичною підготовкою",
		"ліцей-інтернат",
		"ліцей-інтернат спортивного профілю",
		"мистецький ліцей",
		"міжшкільний навчально-виробничий комбінат",
		"навчально-виховний комплекс (об'єднання)",
		"навчально-реабілітаційний центр",
		"науковий ліцей",
		"науковий ліцей-інтернат",
		,
		"спеціалізована школа-інтернат",
		"позашкільний навчально-виховний комплекс",
		"початкова школа",
		"санаторна школа",
		"санаторна школа-інтернат",
		"спеціальна школа",
		"спеціальна школа-інтернат",
		"спеціалізована школа",
		"спеціалізована школа-інтернат",
		"спортивний ліцей",
		"школа",
		"школа соціальної реабілітації",
		"школа-інтернат",
	];

	const steps = ["Створення акаунту", "Заповнення інформації"];

	const handleSubmition = async (data) => {
		if (institutionData) {
			const validateResponse = await fetch(
				`/api/auth/sign-up/institution/validate`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						userEmail: data.adminUserEmail,
						useedCode: institutionData.useedCode,
						institutionAdminUserId: institutionData.adminUserId,
					}),
				}
			);
			const validateResult = await validateResponse.json();
			if (!validateResult.success) {
				console.error(validateResult.data);
				toast.error(validateResult.data);
			} else {
				const response = await fetch(`/api/requests`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(data),
				});
				const result = await response.json();
				if (result.success) {
					setShowPopup(true);
				} else {
					console.error(result.data);
					toast.error(result.data);
				}
			}
		}
	};

	return (
		<div className={authStyles.authPage}>
			{showPopup && (
				<InfoPopup
					linkForButtonOkay={"/"}
					pictureSource={"\\images\\checklist.png"}
					text={
						"Ваша заявка була відправлена адміністратору. У разі її схвалення на вашу електронну пошту надійде лист з подальшими інструкціями"
					}
					heading={"Заявку успішно створено"}
				/>
			)}
			<div>
				<div className={authStyles.logo}>
					<img
						src="\images\Logo.svg"
						alt="Logo"
					/>
					<h1>ConnectedMinds</h1>
				</div>
				<h3>Маєш акаунт?</h3>
				<Link
					className={authStyles.link}
					href="/auth/sign-in">
					Увійти
				</Link>
			</div>
			<div className={multiStepFormStyles.container}>
				<div className={multiStepFormStyles.progressBar}>
					{steps.map((step, index) => (
						<React.Fragment key={index}>
							{index !== 0 && (
								<div
									key={`line-${index}`}
									className={`${multiStepFormStyles.line} ${
										activeTab >= index
											? multiStepFormStyles.activeLine
											: ""
									}`}></div>
							)}
							<div
								key={`step-${index}`}
								className={multiStepFormStyles.step}>
								<div className={multiStepFormStyles.stepName}>
									<p>{step}</p>
									<div
										className={`${
											multiStepFormStyles.bullet
										} ${
											activeTab >= index
												? multiStepFormStyles.activeBullet
												: ""
										}`}>
										<span>{index + 1}</span>
									</div>
								</div>
							</div>
						</React.Fragment>
					))}
				</div>
				<form
					onSubmit={handleSubmit(handleSubmition)}
					className={`${standartStyles.form}`}
					encType="application/json"
					method="POST">
					<div
						className={
							activeTab !== 0
								? multiStepFormStyles.visibilityCollapse
								: ""
						}>
						<p className={multiStepFormStyles.paragraphNote}>
							Даний акаунт матиме найвищі права адміністратора та
							зможе призначати інших адміністраторів
						</p>
						<fieldset>
							<div>
								<LuMail className={multiStepFormStyles.icon} />
								<label>Email*</label>
							</div>
							<input
								type="email"
								className={`${standartStyles.inputRegular}`}
								placeholder="maria.marienko@mail.com"
								{...register("adminUserEmail", {
									required: "Ви пропустили email",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Формат email невірний",
									},
								})}
							/>
							{errors.adminUserEmail && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.adminUserEmail.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<MdOutlinePassword
									className={multiStepFormStyles.icon}
								/>
								<label>Пароль*</label>
							</div>
							<input
								className={`${standartStyles.inputRegular}`}
								type="password"
								{...register("adminUserPassword", {
									required: "Ви пропустили пароль",
								})}
							/>
							{errors.adminUserPassword && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.adminUserPassword.message}
								</span>
							)}
						</fieldset>
					</div>
					<div
						className={
							activeTab !== 1
								? multiStepFormStyles.visibilityCollapse
								: ""
						}>
						<p className={multiStepFormStyles.paragraphNote}>
							Введіть код ЄДЕБО навчального закладу, який бажаєте
							прив'язати до акаунту. Дані буде заповнено
							автоматично, але їх можна за потреби редагувати
						</p>
						<fieldset>
							<div>
								<TbCodeAsterisk className={authStyles.icon} />
								<label>Код ЄДЕБО*</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="123456"
								{...register("useedCode", {
									required: "Код ЄДЕБО обов'язковий",
									minLength: {
										value: 6,
										message:
											"Код ЄДЕБО повинен бути довжиною 6 символів",
									},
									pattern: {
										value: /^\d{6}$/,
										message:
											"Код ЄДЕБО має складатися лише з цифр",
									},
								})}
							/>
							{errors.useedCode && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.useedCode.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbPencilMinus className={authStyles.icon} />
								<label>Повна назва закладу освіти*</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="Повна назва закладу"
								{...register("fullname", {
									required: "Повна назва обов'язкова",
								})}
							/>
							{errors.fullname && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.fullname.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbPencilMinus className={authStyles.icon} />
								<label>Скорочена назва закладу освіти*</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="Скорочена назва закладу"
								{...register("shortname", {
									required: "Скорочена назва обов'язкова",
								})}
							/>
							{errors.shortname && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.shortname.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbSchool className={authStyles.icon} />
								<label>Тип закладу*</label>
							</div>
							<select
								className={`${standartStyles.selectRegular}`}
								placeholder="Тип закладу"
								{...register("institutionType", {
									required: "Тип закладу обов'язковий",
								})}>
								<option value="">Оберіть тип закладу</option>
								{institutionTypes.map((el, index) => (
									<option
										key={index}
										value={el}>
										{el}
									</option>
								))}
							</select>
							{errors.institutionType && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.institutionType.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbUserDollar className={authStyles.icon} />
								<label>Форма власності*</label>
							</div>
							<select
								className={`${standartStyles.selectRegular}`}
								placeholder="Форма власності"
								{...register("ownershipForm", {
									required: "Форма власності обов'язкова",
								})}>
								<option value="">
									Оберіть форму власності
								</option>
								<option value={"Приватна"}>{"Приватна"}</option>
								<option value={"Комунальна"}>
									{"Комунальна"}
								</option>
								<option value={"Державна"}>{"Державна"}</option>
								<option value={"Корпоративна"}>
									{"Корпоративна"}
								</option>
							</select>
							{errors.ownershipForm && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.ownershipForm.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbCodeAsterisk className={authStyles.icon} />
								<label>Код КОАТУУ*</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="Код КОАТУУ"
								{...register("coatsuuCode", {
									required: "Код КОАТУУ обов'язковий",
									minLength: {
										value: 10,
										message:
											"Код КОАТУУ повинен бути довжиною 10 символів",
									},
									pattern: {
										value: /^\d{10}$/,
										message:
											"Код КОАТУУ має складатися лише з цифр",
									},
								})}
							/>
							{errors.coatsuuCode && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.coatsuuCode.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbCodeAsterisk className={authStyles.icon} />
								<label>
									Орган, до сфери управління якого належить
									заклад освіти*
								</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="Управління освіти Житомирської обласної державної адміністрації"
								{...register(
									"governingBodyInChargeOfEducation",
									{
										required:
											"Назва органу управління обов'язкова",
									}
								)}
							/>
							{errors.governingBodyInChargeOfEducation && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{
										errors.governingBodyInChargeOfEducation
											.message
									}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<MdOutlineAddLocationAlt
									className={authStyles.icon}
								/>
								<label>Область*</label>
							</div>
							<select
								className={`${standartStyles.selectRegular}`}
								{...register("region", {
									required: "Регіон обов'язковий",
								})}
								onChange={handleRegionSelection}>
								<option value="">Оберіть ол</option>
								{regions &&
									regions.map((el, index) => (
										<option
											key={index}
											value={el}>
											{el}
										</option>
									))}
							</select>
							{errors.region && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.region.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<MdOutlineAddLocationAlt
									className={authStyles.icon}
								/>
								<label>Населений пункт*</label>
							</div>
							<Controller
								name="settlement"
								control={control}
								rules={{
									required:
										"Населений пункт не може бути пустим",
								}}
								render={({ field: { onChange, value } }) => (
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
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.settlement.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<MdOutlineAddLocationAlt
									className={authStyles.icon}
								/>
								<label>Адреса*</label>
							</div>
							<input
								type="text"
								className={`${standartStyles.inputRegular}`}
								placeholder="вул. Вишнева, буд. 131а/б"
								{...register("address", {
									required: "Адреса обов'язкова",
								})}
							/>
							{errors.address && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.address.message}
								</span>
							)}
						</fieldset>
						<label className={multiStepFormStyles.labelTitle}>
							Контактні дані закладу освіти*
						</label>
						<fieldset>
							<div>
								<LuMail className={multiStepFormStyles.icon} />
								<label>Email закладу*</label>
							</div>
							<input
								type="email"
								className={`${standartStyles.inputRegular}`}
								placeholder="someschool10203@mail.com"
								{...register("email", {
									required: "Ви пропустили email закладу",
									pattern: {
										value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
										message: "Формат email невірний",
									},
								})}
							/>
							{errors.email && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.email.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<LuPhone className={authStyles.icon} />
								<label>Телефон*</label>
							</div>
							<input
								type="tel"
								className={`${standartStyles.inputRegular}`}
								placeholder="+38(067)9998877"
								{...register("phoneNumber", {
									required: "Ви пропустили номер телефону",
									pattern: {
										value: /^\+38\(\d{3}\)\d{3}-\d{2}-\d{2}$/,
										message: "Формат номеру невірний",
									},
								})}
							/>
							{errors.phoneNumber && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.phoneNumber.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbLink className={authStyles.icon} />
								<label>{`Веб-сайт (не обов'язково)`}</label>
							</div>
							<input
								type="url"
								className={`${standartStyles.inputRegular}`}
								placeholder="www.website.com"
								{...register("website", { required: false })}
							/>
							{errors.website && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.website.message}
								</span>
							)}
						</fieldset>

						<label className={multiStepFormStyles.labelTitle}>
							Інформація про директорку/директора*
						</label>
						<fieldset>
							<div>
								<TbPencilMinus className={authStyles.icon} />
								<label>Ім'я*</label>
							</div>
							<input
								className={`${standartStyles.inputRegular}`}
								placeholder="Марія"
								{...register("firstname", {
									required: "Ім'я обов'язкове",
								})}
							/>
							{errors.firstname && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.firstname.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbPencilMinus className={authStyles.icon} />
								<label>Прізвище*</label>
							</div>
							<input
								className={`${standartStyles.inputRegular}`}
								placeholder="Марієнко"
								{...register("lastname", {
									required: "Прізвище обов'язкове",
								})}
							/>
							{errors.lastname && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.lastname.message}
								</span>
							)}
						</fieldset>
						<fieldset>
							<div>
								<TbPencilMinus className={authStyles.icon} />
								<label>По матері / по батькові*</label>
							</div>
							<input
								className={`${standartStyles.inputRegular}`}
								placeholder="Маріївна"
								{...register("antroponym", {
									required:
										"По матері або по батькові обов'язкове",
								})}
							/>
							{errors.antroponym && (
								<span
									className={
										multiStepFormStyles.errorMessage
									}>
									{errors.antroponym.message}
								</span>
							)}
						</fieldset>
					</div>
					<div className={multiStepFormStyles.buttons}>
						<div
							className={
								multiStepFormStyles.buttons__backAndNext
							}>
							{activeTab !== 0 && (
								<input
									onClick={() =>
										setActiveTab((prev) => prev - 1)
									}
									className={multiStepFormStyles.buttons}
									value="Назад 👈🏻"
									type="button"
								/>
							)}
							{activeTab !== steps.length - 1 && (
								<input
									onClick={() =>
										setActiveTab((prev) => prev + 1)
									}
									className={multiStepFormStyles.buttons}
									value="Далі 👉🏻"
									type="button"
								/>
							)}
						</div>
						{activeTab === steps.length - 1 ? (
							<button
								type="submit"
								className={standartStyles.buttonSubmit}
								onClick={handleSubmit(handleSubmition)}>
								Зареєструвати заклад
							</button>
						) : null}
					</div>
				</form>
			</div>
		</div>
	);
}
