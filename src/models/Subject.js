import { connectToAppDatabase } from "@/lib/db";

class Subject {
	static async findAll() {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(`SELECT * FROM subjects ORDER BY name, classes_type ASC`);
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
				`SELECT * FROM subjects WHERE id=?`,
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

	static async findByNameAndClassesType(name, classesType) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`SELECT * FROM subjects WHERE name=? AND classes_type=?`,
				[name, classesType]
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
				`DELETE FROM subjects WHERE id=?`,
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

	static async updateById(id, name, classesType) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`UPDATE subjects SET name=?, classes_type=? WHERE id=?`,
				[name, classesType, id]
			);
			await connection.end();
			return { success: true, data: result[0][0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}


	static async add(name, classesType) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`INSERT INTO subjects(name, classes_type) VALUES(?, ?)`,
				[name, classesType]
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

module.exports = Subject;
