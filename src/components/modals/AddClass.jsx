import styles from "./Popups.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { TbPencilMinus, TbMail } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddClass({ onClose, isVisible }) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = async (data) => {
		const response = await fetch(`/api/institution/classes`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		const result = await response.json();
		if (!result.success) {
			toast.error(result.data);
			return;
		} else {
			toast.success("Клас успішно додано");
			onClose();
		}
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
										<TbPencilMinus />
									</div>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Назва класу*
									</label>
								</div>
								<input
									defaultValue="1-Г"
									{...register("name", {
										required: "Назва не може бути пустою",
										pattern: {
											value: /^(1[0-1]|[1-9])-[А-ЯІЇЄ][,-яіїє]*$/,
											message:
												"Формат класу невірний. Приклад правильного формату: 1-А, 11-Г",
										},
									})}
								/>
								{errors.name && (
									<span className={styles.errorMessage}>
										{errors.name.message}
									</span>
								)}
							</fieldset>
							<fieldset>
								<div>
									<TbMail className={standartStyles.icon} />
									<label>Email класного керівника/керівниці*</label>
								</div>
								<input
									defaultValue="maria.marchenko@mail.com"
									type="email"
									placeholder="maria.marienko@mail.com"
									{...register("email", {
										required: "Пошта обов'язкова",
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
							<div className={styles.buttons}>
								<button
									className={standartStyles.buttonSubmit}
									type="submit"
									onClick={handleSubmit(onSubmit)}
									label="Увійти">
									Призначити
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
