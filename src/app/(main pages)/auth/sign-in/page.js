'use client';
import authStyles from "@/styles/main pages/Auth.module.scss";
import { useForm } from "react-hook-form";
import { TbMail, TbPasswordUser } from "react-icons/tb";
import Link from "next/link";
import standartStyles from "@/styles/Styles.module.scss";

const signIn = () => {
	const onSubmit = async (data) => {
		const response = await fetch("/api/auth/sign-in", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const result = await response.json();
		if (result.success) {
			window.location.href = "/";
		} else if (response.status === 400) {
			setError("password", {
				type: "custom",
				message: "Пароль невірний",
			});
		} else {
			setError("email", {
				type: "custom",
				message: "Email невірний або користувач не існує",
			});
		}
	};
	const {
		register,
		handleSubmit,
		watch,
		setError,
		formState: { errors },
	} = useForm();

	return (
		<div className={authStyles.authPage}>
			<div>
				<div className={authStyles.logo}>
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
			</div>
			<div>
				<form
					encType="application/json"
					className={standartStyles.form}
					method="POST">
					<fieldset>
						<div>
							<TbMail className={standartStyles.icon} />
							<label>Email*</label>
						</div>
						<input
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
							<span className={standartStyles.errorMessage}>
								{errors.email.message}
							</span>
						)}
					</fieldset>
					<fieldset>
						<div>
							<TbPasswordUser className={standartStyles.icon} />
							<label>Пароль*</label>
						</div>
						<input
							type="password"
							{...register("password", {
								required: "Пароль обов'язковий",
							})}
						/>
						{errors.password && (
							<span className={standartStyles.errorMessage}>
								{errors.password.message}
							</span>
						)}
					</fieldset>
					<fieldset>
						<div>
							<a href="/auth/reset-password">Забули пароль?</a>
						</div>
					</fieldset>
					<button
						className={standartStyles.buttonSubmit}
						type="submit"
						onClick={handleSubmit(onSubmit)}
						label="Увійти">
						Увійти
					</button>
				</form>
			</div>
		</div>
	);
};

export default signIn;
