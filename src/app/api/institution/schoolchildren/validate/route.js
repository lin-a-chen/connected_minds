import Schoolchild from "@/models/Schoolchild";
import User from "@/models/User";
import Class from "@/models/Class";

export async function POST(req) {
	const body = await req.json();
	try {
		const userResult = await User.findByEmail(body.email);

		if (!userResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося перевірити чи користувач вже існує",
				}),
				{ status: 500 }
			);
		}

		if (userResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Вже є користувачка/користувач з таким email",
				}),
				{ status: 500 }
			);
		}

    const class_name = body.classNumber + '-' + body.classLetter;
		const classesResult = await Class.findByName(class_name);
		if (!classesResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вдалося знайти такий клас",
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
						class_name +
						" не існує або його не знайдено",
				}),
				{ status: 404 }
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
