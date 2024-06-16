import { connectToAppDatabase } from "@/lib/db";

class Schedule {
	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT sch.*, less.*, subjects.name as subject_name, classes.name as class_name, classes.type as class_type, classes.id as class_id
			FROM schedule AS sch
			INNER JOIN lessons as less ON sch.id = less.schedule_id
			INNER JOIN classes ON sch.class_id = classes.id
			INNER JOIN subjects ON less.subject_id = subjects.id`);
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
			const result = await connection.query(`SELECT classes.name as class_name, sch.weekday, sch.id as schedule_id, sch.class_id as class_id, less.start_time, less.end_time, less.id as lesson_id, subj.id as subject_id, subj.name as subject_name, subj.classes_type, teachers.firstname, teachers.lastname, teachers.antroponym, teachers.id as teacher_id, users.email as teacher_email
			FROM schedule AS sch
			LEFT JOIN lessons as less ON sch.id = less.schedule_id
			LEFT JOIN classes ON classes.id = sch.class_id 
			LEFT JOIN subjects as subj ON less.subject_id = subj.id
			LEFT JOIN teachers as teachers ON less.teacher_id = teachers.id
			LEFT JOIN users ON teachers.user_id = users.id
			WHERE sch.class_id=?`, [classId]);
			await connection.end();

			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async addWeekForClass(classId) {
		const connection = await connectToAppDatabase();
		try {
			for (let i = 0; i < 5; i++){
				const result = await connection.query(`INSERT INTO schedule(class_id, weekday) VALUES(?, ?)`,
				 [classId, (i + 1)]);

				if (!result[0].insertId){
					return { success: false, data: `Schedule for weekday ${i + 1} wasn't created`};
				}
			}
			
			await connection.end();
			return { success: true, data: 'success' };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	
}

module.exports = Schedule;
