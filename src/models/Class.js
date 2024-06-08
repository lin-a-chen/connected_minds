import { connectToAppDatabase } from "@/lib/db";
import {v4 as uuidv4} from "uuid";

class Class {
	static generateUUID = () => {
		return uuidv4();
	};
	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT classes.*, teachers.id as teacher_id, teachers.firstname, teachers.lastname, teachers.antroponym
			FROM classes
			INNER JOIN teachers ON classes.teacher_id = teachers.id`);
			// const result = await connection.query(`SELECT *	FROM classes`);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async add(name, teacherId) {
		const connection = await connectToAppDatabase();
		const id = this.generateUUID();
		try {
			const classNumber = name.split('-')[0];
			const classType = classNumber < 5 ? 'Молодша школа' : 'Старша школа';
			const result = await connection.query(`INSERT INTO classes(id, name, type, teacher_id) VALUES(?, ?, ?, ?)`, [id, name, classType, teacherId]);
			await connection.end();
			return { success: true, data: id };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByName(name){
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT * FROM classes WHERE name=?`, [name]);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByTeacherId(id){
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT * FROM classes WHERE teacher_id=?`, [id]);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findById(id){
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT * FROM classes WHERE id=?`, [id]);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

    static async updateById(id, name){
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`UPDATE classes SET name=? WHERE id=?`, [name, id]);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async deleteById(id){
		console.log('deleted!');
		console.log('delete id', id)
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`DELETE FROM classes WHERE id=?`, [id]);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}
}

module.exports = Class;