import { connectToAppDatabase } from "@/lib/db";

class Lesson {
    static convertTimeToMySQL(time) {
		try {
			const [hours, minutes] = time.split(':');
			if (!hours || !minutes) {
				throw new Error('Invalid time format');
			}
			const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
			return formattedTime;
		} catch (error) {
			console.error('Error converting time:', error);
			throw error; // Re-throw the error to be caught in the calling function
		}
	}
	
    
	static async updateById(lesson_id, subject_id, teacher_id, start_time, end_time) {
		const connection = await connectToAppDatabase();
        const startTimeFormatted = this.convertTimeToMySQL(start_time);
        const endTimeFormatted = this.convertTimeToMySQL(end_time);

		try {
			const result = await connection.query(
				`UPDATE lessons SET subject_id=?, teacher_id=?, start_time=?, end_time=? WHERE id=?`,
				[subject_id, teacher_id, startTimeFormatted, endTimeFormatted, lesson_id]
			);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async deleteById(lesson_id) {
		const connection = await connectToAppDatabase();
		try {
			const result = await connection.query(
				`DELETE FROM lessons WHERE id=?`,
				[lesson_id]
			);
			await connection.end();
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async add(subject_id, teacher_id, schedule_id, start_time, end_time) {	
		try {
			const connection = await connectToAppDatabase();	
			const startTimeFormatted = this.convertTimeToMySQL(start_time);
			const endTimeFormatted = this.convertTimeToMySQL(end_time);
	
			const result = await connection.query(
				`INSERT INTO lessons(subject_id, teacher_id, schedule_id, start_time, end_time) VALUES(?, ?, ?, ?, ?)`,
				[subject_id, teacher_id, schedule_id, startTimeFormatted, endTimeFormatted]
			);
	
			await connection.end();
			
			return { success: true, data: result[0] };
		} catch (error) {
			console.error('Error during database operation:', error);
			
			if (connection && connection.end) {
				await connection.end();
			}
	
			return { success: false, data: error };
		}
	}
	
	
}
module.exports = Lesson;
