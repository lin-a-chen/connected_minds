import { connectToAppDatabase } from "@/lib/db";

class AcademicRecord {
	static async findGrade(classId, studentId, date, subjectId) {
		const connection = await connectToAppDatabase();
		const dateObj = new Date(date);
		try {
			const sql = `SELECT * FROM academic_records WHERE class_id=? AND student_id=? AND MONTH(date)=? AND DAY(date)=? AND subject_id=?`;
			const result = await connection.query(sql, [
				classId,
				studentId,
				dateObj.getMonth() + 1,
				dateObj.getDate(),
				subjectId,
			]);
			await connection.end();

			if (result[0][0]) {
				return { success: true, data: result[0] };
			} else {
				return { success: true, data: [] };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByClassIdAndSubjectId(classId, subjectId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT academic_records.*, 
			users.id as teacher_user_id, 
			teachers.firstname as teacher_firstname, 
			teachers.lastname as teacher_lastname, 
			teachers.antroponym as teacher_antroponym, 
			classes.name as class_name, 
			classes.id as class_id, 
			subjects.id as subject_id
	 FROM academic_records 
	 INNER JOIN classes ON academic_records.class_id = classes.id
	 INNER JOIN subjects ON academic_records.subject_id = subjects.id
	 INNER JOIN teachers ON academic_records.teacher_id = teachers.id
	 INNER JOIN users ON teachers.user_id = users.id
	 WHERE classes.id=? AND subjects.id=?`,
				[classId, subjectId]
			);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findBySchoolchildId(schoolchildId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT academic_records.*, teachers.firstname as teacher_firstname, teachers.lastname as teacher_lastname, teachers.antroponym as teacher_antroponym, academic_records.subject_id as thesubject, users.id as teacher_user_id
			FROM academic_records 
			INNER JOIN teachers ON academic_records.teacher_id = teachers.id
			INNER JOIN users ON teachers.user_id = users.id
            WHERE academic_records.student_id = ?`,
				[schoolchildId]
			);

			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async add(
		grade,
		present,
		studentId,
		teacherId,
		classId,
		subjectId,
		date
	) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`INSERT INTO academic_records(grade, present, student_id, teacher_id, class_id, subject_id, date) VALUES(?, ?, ?, ?, ?, ?, ?)`,
				[grade, present, studentId, teacherId, classId, subjectId, date]
			);
			await connection.end();
			if (result[0].insertId) {
				return { success: true, data: result[0].insertId };
			} else {
				return { success: false, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async updateById(id, grade, present, teacherId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`UPDATE academic_records SET grade=?, present=?, teacher_id=? WHERE id=?`,
				[grade, present, teacherId, id]
			);
			await connection.end();
			if (result[0].affectedRows > 0) {
				return { success: true, data: result[0] };
			} else {
				return { success: false, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}
}

module.exports = AcademicRecord;
