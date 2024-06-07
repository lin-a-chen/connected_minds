import Schoolchild from "@/models/Schoolchild";
import User from "@/models/User";
import Class from "@/models/Class";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import Role from "@/models/Role";
import { sendVerificationEmail } from "@/lib/mail";

const parseDateString = (dateString) => {
	const [day, month, year] = dateString
		.split(".")
		.map((part) => parseInt(part, 10));
	return new Date(year, month - 1, day);
};

const generateUUID = () => {
	return uuidv4();
};

export async function GET() {

	try {
		const result = await Schoolchild.findSchoolchildAndUsers();

		if (result.success) {
			return new Response(
				JSON.stringify({ success: true, data: result.data }),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					data: "No schoolchildren found",
				}),
				{ status: 500 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
}

export async function PUT(req) {
	const body = await req.json();

	try {
		const userResult = await User.findByEmail(body.email);

		if (!userResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося знайти користувача за email",
				}),
				{ status: 500 }
			);
		}

		if (!userResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Користувача або користувачки з таким email не існує або не знайдено",
				}),
				{ status: 500 }
			);
		}

		const classesResult = await Class.findByName(body.class_name);
		if (!classesResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося знайти клас учениці/учня",
				}),
				{ status: 500 }
			);
		}

		if (!classesResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data:
						"Класу " +
						body.class_name +
						" не існує або його не знайдено",
				}),
				{ status: 404 }
			);
		}

		const classUpdateResult = await Class.updateById(
			classesResult.data.id,
			body.class_name
		);
		if (!classUpdateResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося оновити класс",
				}),
				{ status: 500 }
			);
		}

		const userUpdateResult = await User.updateById(
			userResult.data.id,
			body.email,
			body.phone_number,
			userResult.data.password,
			userResult.data.is_activated,
			userResult.data.email_token,
			userResult.data.email_token_expires_at
		);

		if (!userUpdateResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося оновити користувача",
				}),
				{ status: 500 }
			);
		}

		const schoolChildResult = await Schoolchild.findByUserId(
			userResult.data.id
		);
		if (!schoolChildResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося знайти ученицю/учня",
				}),
				{ status: 500 }
			);
		}

		if (!schoolChildResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Ученицю/учня не знайдено або такий акаунт не існує",
				}),
				{ status: 500 }
			);
		}

		const insertDate = parseDateString(body.birthdate);
		const formattedDate = insertDate.toISOString().split("T")[0];
		const schoolChildUpdateResult = await Schoolchild.updateById(
			schoolChildResult.data.id,
			body.firstname,
			body.lastname,
			body.antroponym,
			formattedDate,
			body.country,
			body.region,
			body.settlement,
			body.address,
			classesResult.data.id
		);
		if (!schoolChildUpdateResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося оновити дані учениці/учня",
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify({ success: true, data: "Ура!" }), {
			status: 201,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
}

export async function POST(req) {
	const body = await req.json();
	console.log("body", body);

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
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося створити користувача",
				}),
				{ status: 500 }
			);
		}

		const class_name = body.classNumber + "-" + body.classLetter;
		const classesResult = await Class.findByName(class_name);
		if (!classesResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося знайти клас",
				}),
				{ status: 500 }
			);
		}

		if (!classesResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data:
						"Класу " +
						body.class_name +
						" не існує або його не знайдено",
				}),
				{ status: 404 }
			);
		}

		const schoolChildInsertResult = await Schoolchild.add(
			body.firstname,
			body.lastname,
			body.antroponym,
			body.birthdate,
			body.country,
			body.region,
			body.settlement,
			body.address,
			classesResult.data.id,
			userInsertResult.data,
			body.institutionUseedCode
		);
		if (!schoolChildInsertResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося зареєструвати ученицю/учня",
				}),
				{ status: 500 }
			);
		}

		const roleAssignmentResult = await Role.assignRoleByUserId(
			userInsertResult.data,
			"SCHOOLCHILD",
			body.institutionUseedCode
		);
		if (!roleAssignmentResult.success) {
			const data = JSON.stringify({
				success: false,
				data: "Помилка реєстрації учениці/учня",
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
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
}

export async function DELETE(req) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");

	try {
		const schoolchildResult = await Schoolchild.findById(id);
		if (!schoolchildResult.success) {
			return new Response(
				JSON.stringify({
					success: true,
					data: "Couldn't find user to delete",
				}),
				{ status: 200 }
			);
		}

		const userDeleteResult = await User.deleteById(
			schoolchildResult.data.user_id
		);

		if (userDeleteResult.success) {
			return new Response(
				JSON.stringify({
					success: true,
					data: "Schoolchild was successfully deleted",
				}),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't delete schoolchild",
				}),
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
}

export async function PATCH(req) {
    const body = await req.json();
	try {
		const result = await Schoolchild.updateClassById(body.id, body.class_id);

		if (result.success) {
			return new Response(
				JSON.stringify({ success: true, data: result.data }),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({
					success: false,
					data: "No schoolchildren found",
				}),
				{ status: 500 }
			);
		}
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
}
