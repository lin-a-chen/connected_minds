import { connectToAppDatabase } from "@/lib/db";

class Schedule {
	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT sch.*, sub_sch.*
			FROM schedule AS sch
			INNER JOIN subjects_schedules as sub_sch ON sch.id = sub_sch.schedule_id`);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByClassId(classId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT sch.weekday, sub_sch.start_time, sub_sch.end_time, subj.id as subject_id, subj.name as subject_name, subj.classes_type, teachers.firstname, teachers.lastname, teachers.antroponym, teachers.id as teachers_id, users.email as teachers_email
			FROM schedule AS sch
			INNER JOIN subjects_schedules as sub_sch ON sch.id = sub_sch.schedule_id
			INNER JOIN subjects as subj ON sub_sch.subject_id = subj.id
			INNER JOIN teachers as teachers ON sub_sch.teacher_id = teachers.id
			INNER JOIN users ON teachers.user_id = users.id
			WHERE sch.class_id=?`, [classId]);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	// static async findById(id) {
	// 	const connection = await connectToAppDatabase();
	// 	try {
	// 		const result = await connection.query(
	// 			`SELECT * FROM subjects WHERE id=?`,
	// 			[id]
	// 		);
	// 		await connection.end();
	// 		return { success: true, data: result[0][0] };
	// 	} catch (error) {
	// 		await connection.end();
	// 		console.error(error);
	// 		return { success: false, data: error };
	// 	}
	// }

	// static async findByNameAndClassesType(name, classesType) {
	// 	const connection = await connectToAppDatabase();
	// 	try {
	// 		const result = await connection.query(
	// 			`SELECT * FROM subjects WHERE name=? AND classes_type=?`,
	// 			[name, classesType]
	// 		);
	// 		await connection.end();
	// 		return { success: true, data: result[0][0] };
	// 	} catch (error) {
	// 		await connection.end();
	// 		console.error(error);
	// 		return { success: false, data: error };
	// 	}
	// }

	// static async deleteById(id) {
	// 	const connection = await connectToAppDatabase();
	// 	try {
	// 		const result = await connection.query(
	// 			`DELETE FROM subjects WHERE id=?`,
	// 			[id]
	// 		);
	// 		await connection.end();
	// 		return { success: true, data: result[0][0] };
	// 	} catch (error) {
	// 		await connection.end();
	// 		console.error(error);
	// 		return { success: false, data: error };
	// 	}
	// }

	// static async updateById(id, name, classesType) {
	// 	const connection = await connectToAppDatabase();
	// 	try {
	// 		const result = await connection.query(
	// 			`UPDATE subjects SET name=?, classes_type=? WHERE id=?`,
	// 			[name, classesType, id]
	// 		);
	// 		await connection.end();
	// 		return { success: true, data: result[0][0] };
	// 	} catch (error) {
	// 		await connection.end();
	// 		console.error(error);
	// 		return { success: false, data: error };
	// 	}
	// }


	// static async add(name, classesType) {
	// 	const connection = await connectToAppDatabase();
	// 	try {
	// 		const result = await connection.query(
	// 			`INSERT INTO subjects(name, classes_type) VALUES(?, ?)`,
	// 			[name, classesType]
	// 		);
	// 		await connection.end();
	// 		return { success: true, data: result[0][0] };
	// 	} catch (error) {
	// 		await connection.end();
	// 		console.error(error);
	// 		return { success: false, data: error };
	// 	}
	// }
}

module.exports = Schedule;
