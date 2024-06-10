import { connectToAppDatabase } from "@/lib/db";
import {v4 as uuidv4} from "uuid";

class Teacher {
	static generateUUID = () => {
		return uuidv4();
	};

	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM teachers`
			);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findById(id) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM teachers WHERE id=?`, [id]
			);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByUserId(userId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM teachers WHERE user_id=?`,
				[userId]
			);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findTeacherAndUser() {
		const connection = await connectToAppDatabase();
		try {
			const result =
				await connection.query(`SELECT tchr.*, users.email, users.phone_number, users.photo, users.is_activated
			FROM teachers AS tchr 
			INNER JOIN users ON tchr.user_id = users.id`);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findTeacherAndUserById(id) {
		const connection = await connectToAppDatabase();
		console.log('id', id)
		try {
			const result =
				await connection.query(`SELECT tchr.*, users.email, users.phone_number, users.photo, users.is_activated
			FROM teachers AS tchr 
			INNER JOIN users ON tchr.user_id = users.id
			WHERE tchr.id = ?`, [id]);
			await connection.end();
			console.log('teach', result[0][0])
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async updateById(
		id,
		firstname,
		lastname,
		antroponym,
		birthdate,
		country,
		region,
		settlement,
		address,
		position
	) {

		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`UPDATE teachers SET firstname=?, lastname=?, antroponym=?, birthdate=?, country=?, region=?, settlement=?, address=?, position=? WHERE id=?`,
				[
					firstname,
					lastname,
					antroponym,
					birthdate,
					country,
					region,
					settlement,
					address,
					position,
					id,
				]
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
		firstname,
		lastname,
		antroponym,
		birthdate,
		country,
		region,
		settlement,
		address,
		user_id,
		position,
		institution_useed_code
	) {
		const connection = await connectToAppDatabase();
		try {
			const id = this.generateUUID();
			const result = await connection.query(
				`INSERT INTO teachers(id, firstname, lastname, antroponym, birthdate, country, region, settlement, address, user_id, position, institution_useed_code) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					id,
					firstname,
					lastname,
					antroponym,
					birthdate,
					country,
					region,
					settlement,
					address,
					position,
					user_id,
					institution_useed_code
				]
			);
			await connection.end();
			return { success: true, data: result[0] };
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
				`DELETE FROM teachers WHERE id=?`,
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
}

module.exports = Teacher;
