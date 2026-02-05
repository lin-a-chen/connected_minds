"use client";
import { useEffect, useState } from "react";
import { jwtVerify } from "jose";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { MdOutlinePassword } from "react-icons/md";
import styles from "../ResetPassword.module.scss";
import standartStyles from "@/styles/Styles.module.scss";
import { InfoPopup } from "@/components/modals/Popups";

export default function ResetPassword() {
	const [userEmail, setUserEmail] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm({});

	useEffect(() => {
		const currentUrl = window.location.href;
		const url = new URL(currentUrl);
		const pathname = url.pathname;
		const userEmailToken = pathname.split("/").pop();

		const fetchUser = async () => {
			if (userEmailToken) {
				try {
					const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
					const secret = Buffer.from(secretKey, "utf-8");

					const { payload, expiration } = await jwtVerify(
						userEmailToken,
						secret,
						{
							algorithms: ["HS256"],
						}
					);

                    if (expiration < Date.now() / 1000) {
                        toast.error("Ваш лист зміни паролю застарів. Спробуйте ще раз перейти за посиланням \"Забули пароль?\".");
                        return;
                    }

					setUserEmail(payload.email);
				} catch (error) {
					console.error("JWT verification error:", error);
					toast.error("Щось пішло не так. Спробуйте знову");
				}
			} else {
				toast.error(
					'Схоже щось не так з вашим листом відновлення паролю. Спробуйте знову перейти за посиланням "Забули пароль?" на сторінці входу.'
				);
			}
		};

		fetchUser();
	}, []);

	const onSubmit = async (data) => {
		if (userEmail) {
			const response = await fetch(`/api/auth/reset-password`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ ...data, email: userEmail }),
			});
			const result = await response.json();
			if (!result.success) {
				toast.error(result.data);
				return;
			}

            setShowPopup(true);
		}
	};

	return (
		<>
        {showPopup && <InfoPopup pictureSource={'/images/checklist.png'} heading={'Пароль успішно змінено'} text={'Тепер ви можете увійти у свій обліковий запис. Дякуємо, що ви з нами! <3'} linkForButtonOkay={'/auth/sign-in'}/>}
			{userEmail && (
				<div className={styles.page}>
					<div className={styles.logo}>
						<svg
							width="75"
							height="102"
							viewBox="0 0 75 102"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								d="M37.1342 28.1151C33.8502 28.1974 31.1938 30.9216 31.1938 34.2064C31.1938 37.4912 33.8502 40.2153 37.1342 40.2976C52.3308 40.2976 65.0916 52.4151 65.1682 67.6729C65.1689 67.7522 65.1693 67.8311 65.1693 67.9104C65.1693 83.0142 52.7406 95.4426 37.6371 95.4426C37.6225 95.4426 37.6083 95.4426 37.5938 95.4426C37.5899 95.4426 37.5861 95.4426 37.5823 95.4426C35.973 95.4426 34.6487 96.767 34.6487 98.3763V98.3916C34.6601 100.014 35.9718 101.355 37.5938 101.402C57.7208 101.383 74.2723 84.8165 74.2723 64.6895C74.2723 64.6141 74.272 64.539 74.2716 64.4636C74.0801 44.2921 57.3746 28.1151 37.1342 28.1151ZM43.2274 67.8031C43.2128 64.4647 40.4726 61.721 37.1342 61.7023C21.9415 61.7023 9.17681 49.5849 9.10404 34.327C9.10328 34.2477 9.10287 34.1688 9.10287 34.0896C9.10287 18.9857 21.5317 6.55728 36.6352 6.55728H36.6785H36.6899C38.2992 6.55728 39.6236 5.23294 39.6236 3.62367C39.6236 3.61869 39.6236 3.61332 39.6236 3.60835C39.6121 1.98567 38.3004 0.645251 36.6785 0.598145C16.5514 0.616527 -0.00012207 17.1834 -0.00012207 37.3104C-0.00012207 37.3859 0.000266331 37.4609 0.000649309 37.5364C0.195968 57.7078 16.8976 73.8848 37.1495 73.8848C40.4749 73.858 43.2025 71.1285 43.2274 67.8031Z"
								fill="white"
							/>
						</svg>
						<h1>ConnectedMinds</h1>
					</div>
					<div className={styles.formContainer}>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className={standartStyles.form}>
							<p>Скинути пароль</p>
							<fieldset>
								<div>
									<MdOutlinePassword
										className={styles.icon}
									/>
									<label
										className={
											standartStyles.labelForFormElements
										}>
										Введіть новий пароль*
									</label>
								</div>
								<input
									className={`${standartStyles.inputRegular}`}
									type="password"
									{...register("password", {
										required: "Enter a new password",
										minLength: {
											value: 8,
											message:
												"Password must be at least 8 characters long",
										},
										validate: {
											hasUpperCase: (value) =>
												/[A-Z]/.test(value) ||
												"Password must contain at least one uppercase letter",
											hasLowerCase: (value) =>
												/[a-z]/.test(value) ||
												"Password must contain at least one lowercase letter",
											hasNumber: (value) =>
												/\d/.test(value) ||
												"Password must contain at least one number",
											hasSpecialChar: (value) =>
												/[!@#$%^&*]/.test(value) ||
												"Password must contain at least one special character",
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
										required: "Repeat the password",
										validate: (value) =>
											value === watch("password") ||
											"Passwords do not match",
									})}
								/>
								{errors.repeatPassword && (
									<span className={styles.errorMessage}>
										{errors.repeatPassword.message}
									</span>
								)}
							</fieldset>
							<button
								className={standartStyles.buttonRegular}
								type="submit">
								Підтвердити
							</button>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
