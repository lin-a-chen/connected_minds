import Institution from "@/models/Institution";
import User from "@/models/User";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcrypt";
import Role from "@/models/Role";

const generateUUID = () => {
	return uuidv4();
};

export const POST = async (req) => {
	const body = await req.json();

	try {
		const emailToken = generateUUID();

		const password = await bcrypt.hash(body.password, 10);
		const userInsertResult = await User.add(
			body.email,
			body.phoneNumber,
			password,
			emailToken
		);
		if (!userInsertResult.success) {
			const data = JSON.stringify({
				success: false,
				data: "Помилка реєстрації користувача",
			});
			return new Response(data, { status: 500 });
		}

		const roleAssignmentResult = await Role.assignRoleByUserId(
			userInsertResult.data,
			"INSTITUTION_ADMIN",
			body.useedCode
		);
		if (!roleAssignmentResult.success) {
			const data = JSON.stringify({
				success: false,
				data: "Помилка призначення користувача адміністратором",
			});
			return new Response(data, { status: 500 });
		}

		await sendVerificationEmail(body.email, emailToken);

		return new Response(JSON.stringify({ success: true, data: "Ура!" }), {
			status: 201,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Помилка на сервері" }),
			{ status: 500 }
		);
	}
};
