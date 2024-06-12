// import { connectToAppDatabase } from "@/lib/db";

// class HomeWork {

// 	static formatDateToMySQL (date)  {
// 		const year = date.getFullYear();
// 		const month = String(date.getMonth() + 1).padStart(2, '0');
// 		const day = String(date.getDate()).padStart(2, '0');
// 		const hours = String(date.getHours()).padStart(2, '0');
// 		const minutes = String(date.getMinutes()).padStart(2, '0');
// 		const seconds = String(date.getSeconds()).padStart(2, '0');
	
// 		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// 	};

// 	static async findAllByClassAndSubject(classId, subjectId) {
// 		const connection = await connectToAppDatabase();
// 		try {
// 			const result = await connection.query(
// 				`SELECT home.*, subj.name as subject_name, subj.classes_type as subject_classes_type, t.firstname as teacher_firstname, t.lastname as teacher_lastname, t.antroponym as teacher_antroponym, t.id as teacher_id, classes.name as class_name, classes.id as class_id, classes.type as class_type
//             FROM homework as home 
//             INNER JOIN subjects as subj ON home.subject_id = subj.id
//             INNER JOIN teachers as t ON home.teacher_id = t.id
//             INNER JOIN classes ON home.class_id = classes.id
//             WHERE class_id = ? AND subject_id=?
//             ORDER BY assignment_date DESC, deadline DESC`,
// 				[classId, subjectId]
// 			);
// 			await connection.end();
// 			return { success: true, data: result[0] };
// 		} catch (error) {
// 			await connection.end();
// 			console.error(error);
// 			return { success: false, data: error };
// 		}
// 	}

// 	static async findByDeadline(deadline) {
// 		const connection = await connectToAppDatabase();
// 		try {
// 			const result = await connection.query(
// 				`SELECT * from homework WHERE deadline=?`,
// 				[deadline]
// 			);
// 			await connection.end();
// 			return { success: true, data: result[0][0] };
// 		} catch (error) {
// 			await connection.end();
// 			console.error(error);
// 			return { success: false, data: error };
// 		}
// 	}

// 	static async deleteById(id) {
// 		const connection = await connectToAppDatabase();
// 		try {
// 			const result = await connection.query(
// 				`DELETE FROM homework WHERE id=?`,
// 				[id]
// 			);
// 			await connection.end();
// 			return { success: true, data: result[0][0] };
// 		} catch (error) {
// 			await connection.end();
// 			console.error(error);
// 			return { success: false, data: error };
// 		}
// 	}

// 	static async updateById(
// 		id,
// 		subjectId,
// 		teacherId,
// 		classId,
// 		description,
// 		deadline
// 	) {
// 		const connection = await connectToAppDatabase();
// 		const assignmentDate = this.formatDateToMySQL(new Date());
// 		const deadlineFormatted = this.formatDateToMySQL(new Date(deadline));
	
// 		try {
// 			const result = await connection.query(
// 				`UPDATE homework SET subject_id=?, class_id=?, description=?, deadline=?, assignment_date=? WHERE id=?`,
// 				[
// 					subjectId,
// 					teacherId,
// 					classId,
// 					description,
// 					deadlineFormatted,
// 					assignmentDate,
// 					id,
// 				]
// 			);
// 			await connection.end();
// 			if (result.affectedRows > 0) {
// 				return { success: true, data: result[0][0] };
// 			} else return { success: false, data: null };
// 		} catch (error) {
// 			await connection.end();
// 			console.error(error);
// 			return { success: false, data: error };
// 		}
// 	}

// 	static async add(subjectId, teacherId, classId, description, deadline) {
// 		const connection = await connectToAppDatabase();
// 		const deadlineFormatted = this.formatDateToMySQL(new Date(deadline));
// 		const assignmentDate = this.formatDateToMySQL(new Date());
// 		try {
// 			const result = await connection.query(
// 				`INSERT INTO homework(subject_id, teacher_id, class_id, description, deadline, assignment_date) VALUES(?, ?, ?, ?, ?, ?)`,
// 				[
// 					subjectId,
// 					teacherId,
// 					classId,
// 					description,
// 					deadlineFormatted,
// 					assignmentDate,
// 				]
// 			);
// 			await connection.end();
// 			if (result[0].insertId) {
// 				return { success: true, data: result[0].insertId };
// 			} else {
// 				return { success: false, data: null };
// 			}
// 		} catch (error) {
// 			await connection.end();
// 			console.error(error);
// 			return { success: false, data: error };
// 		}
// 	}
// }

// module.exports = HomeWork;

import { connectToAppDatabase } from "@/lib/db";

class HomeWork {

    static formatDateToMySQL(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    static async findAllByClassAndSubject(classId, subjectId) {
        const connection = await connectToAppDatabase();
        try {
            const result = await connection.query(
                `SELECT home.*, subj.name as subject_name, subj.classes_type as subject_classes_type, t.firstname as teacher_firstname, t.lastname as teacher_lastname, t.antroponym as teacher_antroponym, t.id as teacher_id, classes.name as class_name, classes.id as class_id, classes.type as class_type
                FROM homework as home 
                INNER JOIN subjects as subj ON home.subject_id = subj.id
                INNER JOIN teachers as t ON home.teacher_id = t.id
                INNER JOIN classes ON home.class_id = classes.id
                WHERE class_id = ? AND subject_id=?
                ORDER BY assignment_date DESC, deadline DESC`,
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

    static async findByDeadline(deadline) {
        const connection = await connectToAppDatabase();
        try {
            const result = await connection.query(
                `SELECT * from homework WHERE deadline=?`,
                [deadline]
            );
            await connection.end();
            return { success: true, data: result[0][0] };
        } catch (error) {
            await connection.end();
            console.error(error);
            return { success: false, data: error };
        }
    }

    static async deleteById(id) {
        const connection = await connectToAppDatabase();
        try {
            const result = await connection.query(
                `DELETE FROM homework WHERE id=?`,
                [id]
            );
            await connection.end();
            return { success: true, data: result[0][0] };
        } catch (error) {
            await connection.end();
            console.error(error);
            return { success: false, data: error };
        }
    }

    static async updateById(
        id,
        subjectId,
        teacherId,
        classId,
        description,
        deadline
    ) {
        const connection = await connectToAppDatabase();
        const assignmentDate = this.formatDateToMySQL(new Date());
        const deadlineFormatted = this.formatDateToMySQL(new Date(deadline));

        try {
            const result = await connection.query(
                `UPDATE homework SET subject_id=?, teacher_id=?, class_id=?, description=?, deadline=?, assignment_date=? WHERE id=?`,
                [
                    subjectId,
                    teacherId,
                    classId,
                    description,
                    deadlineFormatted,
                    assignmentDate,
                    id,
                ]
            );
            await connection.end();
            if (result[0].affectedRows > 0) {
                return { success: true, data: result[0][0] };
            } else return { success: false, data: null };
        } catch (error) {
            await connection.end();
            console.error(error);
            return { success: false, data: error };
        }
    }

    static async add(subjectId, teacherId, classId, description, deadline) {
        const connection = await connectToAppDatabase();
        const deadlineFormatted = this.formatDateToMySQL(new Date(deadline));
        const assignmentDate = this.formatDateToMySQL(new Date());
        try {
            const result = await connection.query(
                `INSERT INTO homework(subject_id, teacher_id, class_id, description, deadline, assignment_date) VALUES(?, ?, ?, ?, ?, ?)`,
                [
                    subjectId,
                    teacherId,
                    classId,
                    description,
                    deadlineFormatted,
                    assignmentDate,
                ]
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
}

module.exports = HomeWork;
