import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import {
	LuMail,
	LuPhone,
	LuBaby,
	LuClock2,
	LuPencilLine,
} from "react-icons/lu";
import { TbId, TbPencilMinus, TbSchool } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { MdOutlinePassword } from "react-icons/md";
import AutocompleteInput from "../UI/AutocompleteInput";
import { SiGoogleclassroom } from "react-icons/si";
import { useEffect } from "react";

export default function AddHomework({ onClose, isVisible, subjects, classLetters, user }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		control,
        setValue
	} = useForm();



	const onSubmit = async (data) => {
		const response = await fetch(`/api/institution/homework`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({...data, user}),
		});
		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		}
            toast.success('Домашнє завдання успішно додано')
			onClose();
	};

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
										<TbSchool
										// className={authStyles.icon}
										/>
									</div>
									<label>Предмет*</label>
								</div>
								<Controller
									name="subject"
									control={control}
									rules={{
										required:
											"Предмет не може бути пустим",
									}}
									render={({
										field: { onChange, value },
									}) => (
										<AutocompleteInput
											dataToSearch={subjects}
											value={value}
											onChange={onChange}
											// defaultValue={
											// 	watch().subject
											// 		? watch().subject
											// 		: "Природознавство"
											// }
										/>
									)}
								/>
								{errors.subject && (
									<span
										className={
											standartStyles.errorMessage
										}>
										{errors.subject.message}
									</span>
								)}
							</fieldset>
							<fieldset>
                                    <div>
                                        <div className={standartStyles.icon}>
                                            <SiGoogleclassroom />
                                        </div>
                                        <label
                                            className={
                                                standartStyles.labelForFormElements
                                            }>
                                            Клас*
                                        </label>
                                    </div>
									<div>
										<input
                                        {...register("classNumber", {
											required: "Це поле обов'язкове",
										})}
											className={
												standartStyles.inputRegular
											}
											defaultValue="1"
											type="number"
											min="1"
											max="11"
											placeholder="1"
											// onChange={handleClassNumberChange}
										/>
										<select
                                        {...register("classLetter", {
											required: "Це поле обов'язкове",
										})}
											className={
												standartStyles.selectRegular
											}
											// onChange={handleClassLetterChange}
                                            >
											{classLetters &&
												classLetters.map(
													(el, index) => (
														<option
															key={index}
															value={el}>
															{el}
														</option>
													)
												)}
										</select>
                                        
									</div>
                                {errors.classesType && (
									<span className={styles.errorMessage}>
										{errors.classesType.message}
									</span>
								)}
                                {errors.classesType && (
									<span className={styles.errorMessage}>
										{errors.classesType.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<div className={standartStyles.icon}>
										<LuClock2 />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Виконати до*
									</label>
								</div>

								<div>
									<input
										type="date"
										{...register("deadline", {
											required: "Це поле обов'язкове",
										})}
									/>
								</div>
								{errors.classesType && (
									<span className={styles.errorMessage}>
										{errors.classesType.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<div className={standartStyles.icon}>
										<LuPencilLine />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Опис*
									</label>
								</div>

								<div>
									<textarea
										className={standartStyles.inputRegular}
										{...register("description", {
											required: "Це поле обов'язкове",
										})}></textarea>
								</div>
								{errors.classesType && (
									<span className={styles.errorMessage}>
										{errors.classesType.message}
									</span>
								)}
							</fieldset>
							<div className={styles.buttons}>
								<button
									className={standartStyles.buttonSubmit}
									type="submit"
									onClick={handleSubmit(onSubmit)}>
									Зберегти
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
