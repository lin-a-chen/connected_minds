import Homework from "@/models/Homework";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import Teacher from "@/models/Teacher";

export const GET = async (req) => {
	const { searchParams } = new URL(req.url);
	const className = searchParams.get("class");
	const subject = searchParams.get("subject");
	try {
		const classResult = await Class.findByName(className);

		if (!classResult.success) {
			return new Response(
				JSON.stringify({ success: false, data: "Class not found" }),
				{ status: 404 }
			);
		}

		const subjectResult = await Subject.findByNameAndClassesType(
			subject,
			classResult.data.type
		);

		if (!subjectResult.success) {
			return new Response(
				JSON.stringify({ success: false, data: "Subject not found" }),
				{ status: 404 }
			);
		}

		const result = await Homework.findAllByClassAndSubject(
			classResult.data.id,
			subjectResult.data.id
		);

		if (result.success) {
			return new Response(
				JSON.stringify({ success: true, data: result.data }),
				{ status: 200 }
			);
		} else {
			return new Response(
				JSON.stringify({ success: false, data: "Homeworks not found" }),
				{ status: 404 }
			);
		}
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};

export const POST = async (req) => {
	const body = await req.json();
	try {
		const classResult = await Class.findByName(
			`${body.classNumber}-${body.classLetter}`
		);

		if (!classResult.success) {
			return new Response(
				JSON.stringify({ success: false, data: "Клас не знайдено" }),
				{ status: 404 }
			);
		}

		const subjectResult = await Subject.findByNameAndClassesType(
			body.subject,
			classResult.data.type
		);

		if (!subjectResult.success) {
			return new Response(
				JSON.stringify({ success: false, data: "Предмет не знайдено" }),
				{ status: 404 }
			);
		}

		const teacherResult = await Teacher.findByUserId(body.user.id);

		if (!teacherResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Вчителя/вчительки не знайдено",
				}),
				{ status: 404 }
			);
		}

		const result = await Homework.add(
			subjectResult.data.id,
			teacherResult.data.id,
			classResult.data.id,
			body.description,
			body.deadline
		);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вийшло додати домашнє завдання :(",
				}),
				{ status: 500 }
			);
		}
		return new Response(JSON.stringify({ success: true, data: "Ура" }), {
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};

export const PUT = async (req) => {
	const body = await req.json();
	try {
		const result = await Homework.updateById(
			body.id,
			body.subjectId,
			body.teacherId,
			body.classId,
			body.description,
			body.deadline
		);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вийшло змінити домашнє завдання :(",
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify({ success: true, data: "Ура" }), {
			status: 201,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};

export const DELETE = async (req) => {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get("id");
	try {
		const result = await Homework.deleteById(id);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вийшло видалити домашнє завдання :(",
				}),
				{ status: 500 }
			);
		}
		return new Response(JSON.stringify({ success: true, data: "Ура" }), {
			status: 200,
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};
