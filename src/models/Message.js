import { connectToAppDatabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

class Message {
    static generateUUID = () => {
		return uuidv4();
	};

    static async findByRoomId(roomId){
		const connection = await connectToAppDatabase();

        try {
			const result = await connection.query(
				`SELECT * FROM messages WHERE room_id = ? ORDER BY sending_datetime ASC LIMIT 200`,
				[roomId]
			);
			await connection.end();
            if (result[0] && result[0].length > 0){
                return { success: true, data: result[0] };
            }
            else{
                return { success: false, data: null };
            }
			
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
    }

    static async add(room_id, sender_id, text){

        const id = this.generateUUID();
		const connection = await connectToAppDatabase();

        try {
            const result = await connection.query(
				`INSERT INTO messages(id, room_id, sender_id, text) VALUES(?, ?, ?, ?)`,
				[id, room_id, sender_id, text]
			);
			await connection.end();
            if (result[0].affectedRows > 0){
                return { success: true, data: id };
            }
            else{
                return { success: true, data: null };
            }
			
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
    }
}

module.exports = Message;