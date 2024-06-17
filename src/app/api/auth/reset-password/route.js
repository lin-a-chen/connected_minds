import User from "@/models/User";
import { SignJWT } from "jose";
import { sendResetPasswordMail } from "@/lib/mail";
import bcrypt from "bcrypt";

export async function PATCH(req) {
	const body = await req.json();

	try {
		if (body.password) {
			const hashedPass = await bcrypt.hash(body.password, 10);

			const findUserResult = await User.findByEmail(body.email);

			if (!findUserResult || !findUserResult.data) {
				return new Response(
					JSON.stringify({
						success: true,
						data: "Користувача не знайдено",
					}),
					{
						status: t00,
						headers: { "Content-Type": "application/json" },
					}
				);
			}

			const result = await User.changePassword(findUserResult.data.id, hashedPass);

			if (!result || !result.data) {
				return new Response(
					JSON.stringify({
						success: true,
						data: "Не вийшло змінити пароль",
					}),
					{
						status: t00,
						headers: { "Content-Type": "application/json" },
					}
				);
			}
			return new Response(
				JSON.stringify({ success: true, data: "Успішно" }),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		} else {
			const secret = process.env.NEXT_PUBLIC_SECRET_KEY;

			if (!secret) {
				throw new Error("SECRET_KEY is not defined");
			}

			const { email } = body;

			const user = await User.findByEmail(email);
			if (!user || !user.data) {
				return new Response(
					JSON.stringify({
						success: true,
						data: "Користувача не знайдено або не існує",
					}),
					{
						status: 404,
						headers: { "Content-Type": "application/json" },
					}
				);
			}

			const jwt = await new SignJWT({ email: email })
				.setProtectedHeader({ alg: "HS256" })
				.setExpirationTime("1h")
				.sign(new TextEncoder().encode(secret));

			await sendResetPasswordMail(
				email,
				"Запит на зміну пароля",
				"Якщо це не ви робили запит, терміново змініть свій пароль в особистому кабінеті",
				"Ви зробили запит на зміну паролю. Будь ласка, перейдіть за посиланням нижче, щоб скинути старий пароль та створити новий",
				jwt
			);

			return new Response(
				JSON.stringify({ success: true, data: "Успішно" }),
				{
					status: 201,
					headers: { "Content-Type": "application/json" },
				}
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({
				sucess: false,
				data: "Помилка на сервері. Спробуйте пізніше",
			}),
			{
				status: 500,
			}
		);
	}
}
