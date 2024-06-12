import Homework from "@/models/Homework";
import Class from "@/models/Class";
import Subject from "@/models/Subject";

export const POST = async (req) => {
	const body = await req.json();

	try {
		const result = await Homework.findByDeadline(body.deadline);

		if (!result.success) {
			return new Response(
				JSON.stringify({ success: false, data: "Не вийшло перевірити чи вже є домашнє завдання на цю дату" }),
				{ status: 404 }
			);
		}

        if (result.data){
            return new Response(
				JSON.stringify({ success: false, data: "Вже є домашнє завдання на цю дату" }),
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
};
