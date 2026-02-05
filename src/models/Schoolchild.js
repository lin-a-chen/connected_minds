import { connectToAppDatabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

class Schoolchild {
	static generateUUID = () => {
		return uuidv4();
	};

	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM schoolchildren`
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
				`SELECT schoolchildren.*, classes.name as class_name
				 FROM schoolchildren
				 INNER JOIN classes ON schoolchildren.class_id = classes.id
				   WHERE schoolchildren.id=?`,
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

	static async findByUserId(userId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM schoolchildren WHERE user_id=?`,
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

	static async findSchoolchildAndUsers() {
		const connection = await connectToAppDatabase();
		try {
			const result =
				await connection.query(`SELECT schch.*, users.email, users.phone_number, users.photo, classes.name AS class_name
			FROM schoolchildren AS schch 
			INNER JOIN users ON schch.user_id = users.id
			INNER JOIN classes ON schch.class_id = classes.id`);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findSchoolchildAndUsersByUserId(userId) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT schch.*, users.email, users.phone_number, users.photo, classes.name AS class_name
			FROM schoolchildren AS schch 
			INNER JOIN users ON schch.user_id = users.id
			INNER JOIN classes ON schch.class_id = classes.id
			WHERE user_id=?`,
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

	static async findSchoolchildrenAndUsersByClassId(classID) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT schch.*, users.email, users.phone_number, users.photo, classes.name AS class_name
			FROM schoolchildren AS schch 
			INNER JOIN users ON schch.user_id = users.id
			INNER JOIN classes ON schch.class_id = classes.id
			WHERE schch.class_id = ?`,
				[classID]
			);
			await connection.end();
			return { success: true, data: result[0] };
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
		class_id
	) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`UPDATE schoolchildren SET firstname=?, lastname=?, antroponym=?, birthdate=?, country=?, region=?, settlement=?, address=?, class_id=? WHERE id=?`,
				[
					firstname,
					lastname,
					antroponym,
					birthdate,
					country,
					region,
					settlement,
					address,
					class_id,
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

	static async updateClassById(id, class_id) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`UPDATE schoolchildren SET class_id=? WHERE id=?`,
				[class_id, id]
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
		class_id,
		institution_useed_code
	) {
		const connection = await connectToAppDatabase();
		try {
			const id = this.generateUUID();
			const result = await connection.query(
				`INSERT INTO schoolchildren(id, firstname, lastname, antroponym, birthdate, country, region, settlement, address, user_id, class_id, institution_useed_code) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
					class_id,
					user_id,
					institution_useed_code,
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
				`DELETE FROM schoolchildren WHERE id=?`,
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

module.exports = Schoolchild;
