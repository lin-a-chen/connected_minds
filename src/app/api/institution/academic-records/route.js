import Class from "@/models/Class";
import Schedule from "@/models/Schedule";
import User from "@/models/User";
import Schoolchild from "@/models/Schoolchild";
import Teacher from "@/models/Teacher";
import Subject from "@/models/Subject";
import AcademicRecords from "@/models/AcademicRecords";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const name = searchParams.get("class");
	const subject = searchParams.get("subject");

	try {
		const classResult = await Class.findByName(name);
		if (!classResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't find classes",
				}),
				{ status: 500 }
			);
		}

		if (!classResult.data) {
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
				JSON.stringify({
					success: false,
					data: "Couldn't find subjects",
				}),
				{ status: 500 }
			);
		}

		if (!subjectResult.data) {
			return new Response(
				JSON.stringify({ success: false, data: "Subject not found" }),
				{ status: 404 }
			);
		}

		const academicRecordsResult =
			await AcademicRecords.findByClassIdAndSubjectId(
				classResult.data.id,
				subjectResult.data.id
			);

		if (!academicRecordsResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't find academic records",
				}),
				{ status: 404 }
			);
		}

		if (!academicRecordsResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Academic records not found",
				}),
				{ status: 404 }
			);
		}

		return new Response(
			JSON.stringify({
				success: true,
				data: { academic_records: academicRecordsResult.data },
			}),
			{ status: 200 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: error }),
			{ status: 500 }
		);
	}
}

function parseDateToMySQL(dateString) {
    const [day, month] = dateString.split('.').map(Number);
    const year = new Date().getFullYear();
        const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return formattedDate;
}

export async function POST(req) {
	const body = await req.json();

	try {

		const subjectResult = await Subject.findByNameAndClassesType(body.subjectName, body.classesType);
		if (!subjectResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Не вийшло знайти предмет",
				}),
				{ status: 500 }
			);
		}

		if (!subjectResult.data) {
			return new Response(
				JSON.stringify({ success: false, data: "Такий предмет не знайдено" }),
				{ status: 404 }
			);
		}

		const date = parseDateToMySQL(body.date);

		const findRecordResult = await AcademicRecords.findGrade(
			body.classId,
			body.studentId,
			date,
			subjectResult.data.id
		);
		if (!findRecordResult.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Щось пішло не так :(",
				}),
				{ status: 500 }
			);
		}

		if (!findRecordResult.data) {
			return new Response(
				JSON.stringify({ success: false, data: "Щось пішло не так :(" }),
				{ status: 404 }
			);
		}

		const teacherResult = await Teacher.findByUserId(body.teacherUserId);
			if (!teacherResult.success) {
				return new Response(
					JSON.stringify({
						success: false,
						data: "Не вийшло знайти ваш акаунт для виставлення оцінки :(",
					}),
					{ status: 500 }
				);
			}

			if (!teacherResult.data) {
				return new Response(
					JSON.stringify({ success: false, data: "Не вийшло знайти ваш акаунт для виставлення оцінки :(" }),
					{ status: 404 }
				);
			}

			if (findRecordResult.data && findRecordResult.data.length > 0) {
				const updateRecordResult = await AcademicRecords.updateById(
					findRecordResult.data[0].id, 
					body.grade, 
					body.present, 
					teacherResult.data.id
				);

				if (!updateRecordResult.success) {
					return new Response(
						JSON.stringify({
							success: false,
							data: "Не вийшло змінити оцінку :(",
						}),
						{ status: 500 }
					);
				}
				return new Response(
					JSON.stringify({
						success: true,
						data:  'Оцінку успішно змінено' ,
					}),
					{ status: 201 }
				);
			} else {
				const date = parseDateToMySQL(body.date);
				const addRecordResult = await AcademicRecords.add(
					body.grade, 
					body.present, 
					body.studentId, 
					teacherResult.data.id, 
					body.classId, 
					subjectResult.data.id, 
					date
				);
				if (!addRecordResult.success) {
					return new Response(
						JSON.stringify({
							success: false,
							data: "Не вийшло поставити оцінку :(",
						}),
						{ status: 500 }
					);
				}
	
				return new Response(
					JSON.stringify({
						success: true,
						data:  'Оцінку успішно додано' ,
					}),
					{ status: 201 }
				);
			}
			
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: error }),
			{ status: 500 }
		);
	}
}
