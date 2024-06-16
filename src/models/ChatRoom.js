import { connectToAppDatabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

class ChatRoom {
	static generateUUID = () => {
		return uuidv4();
	};

	static async findByUserIdsAndName(userIds, roomName) {
		const connection = await connectToAppDatabase();

		try {
			const placeholders = userIds.map(() => "?").join(",");
			const query = `
        SELECT room_id 
        FROM user_rooms 
        WHERE user_id IN (${placeholders}) 
        GROUP BY room_id 
        HAVING COUNT(user_id) = ?
        WHERE name=?`;

			const result = await connection.query(query, [
				...userIds,
				userIds.length,
				roomName,
			]);
			await connection.end();
			if (result) {
			}
			return { success: true, data: result[0] };
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async add(name, type) {
		const connection = await connectToAppDatabase();

		try {
			const roomId = this.generateUUID(); // Assuming you generate the UUID here
			const sql = `INSERT INTO chat_rooms (id, name, type) VALUES (?, ?, ?)`;
			const values = [roomId, name, type];
			const result = await connection.query(sql, values);

			await connection.end();

			if (result[0].affectedRows > 0) {
				return { success: true, data: { id: roomId } }; // Return the roomId
			} else {
				return { success: false, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async joinUsers(userIds, roomId) {
		const connection = await connectToAppDatabase();

		try {
			if (!roomId) {
				throw new Error("Room ID is null or undefined");
			}

			const sql = `INSERT INTO user_chat_rooms (id, user_id, room_id) VALUES ${userIds
				.map(() => "(?, ?, ?)")
				.join(",")}`;
			const values = userIds.flatMap((userId) => [
				this.generateUUID(),
				userId,
				roomId,
			]);
			const result = await connection.query(sql, values);

			await connection.end();

			if (result[0].affectedRows > 0) {
				return { success: true, data: result[0] };
			} else {
				return { success: true, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async checkIfInRoom(userId, roomId) {
		const id = this.generateUUID();
		const connection = await connectToAppDatabase();

		try {
			const result = await connection.query(
				`SELECT * from user_chat_rooms WHERE user_id=? AND room_id=?`,
				[userId, roomId]
			);
			await connection.end();
			if (result[0][0]) {
				return { success: true, data: result[0][0] };
			} else {
				return { success: true, data: null };
			}
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
				`SELECT * from user_chat_rooms
                WHERE user_id=?`,
				[userId]
			);
			await connection.end();
			if (result[0].length > 0) {
				return { success: true, data: result[0] };
			} else {
				return { success: true, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findByRoomId(roomId) {
		const connection = await connectToAppDatabase();

		try {
			const result = await connection.query(
				`SELECT * FROM user_chat_rooms
                WHERE room_id=?`,
				[roomId]
			);
			await connection.end();
			if (result[0][0]) {
				return { success: true, data: result[0][0] };
			} else {
				return { success: false, data: null };
			}
		} catch (error) {
			await connection.end();
			console.error(error);
			return { success: false, data: error };
		}
	}

	static async findSecondRoomUser(roomId, userId) {
		const connection = await connectToAppDatabase();
		try {
			const teacherResult = await connection.query(
				`SELECT users.*, teachers.firstname, teachers.lastname, teachers.antroponym
                    from user_chat_rooms as user_rooms
                    INNER JOIN users ON user_rooms.user_id = users.id
                    INNER JOIN teachers ON teachers.user_id = users.id
                    WHERE user_rooms.room_id=? AND user_rooms.user_id != ?`,
				[roomId, userId]
			);
			const schoolchildResult = await connection.query(
				`SELECT users.*, schoolchildren.firstname, schoolchildren.lastname, schoolchildren.antroponym, classes.name as class_name, classes.id as class_id
                    from user_chat_rooms as user_rooms
                    INNER JOIN users ON user_rooms.user_id = users.id
                    INNER JOIN schoolchildren ON schoolchildren.user_id = users.id
                    INNER JOIN classes ON classes.id = schoolchildren.class_id
                    WHERE user_rooms.room_id=? AND user_rooms.user_id != ?`,
				[roomId, userId]
			);

			await connection.end();
			if (teacherResult[0][0]) {
				return { success: true, data: teacherResult[0][0] };
			} else if (schoolchildResult[0][0]) {
				return { success: true, data: schoolchildResult[0][0] };
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

module.exports = ChatRoom;
