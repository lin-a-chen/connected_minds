import { connectToAppDatabase } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

class Teacher{
    static generateUUID = () => {
        return uuidv4();
    };

    static async add(
        firstname, lastname, antroponym, birthdate, region, settlement, address, position, classesType, userId, institutionUseedCode) {
            const connection = await connectToAppDatabase();
        try{
            const teacherId = this.generateUUID();

            const sql = `INSERT INTO teachers(id, firstname, lastname, antroponym, birthdate, region, settlement, address, position, classesType, user_id, institution_useed_code) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = await connection.query(sql, [teacherId, firstname, lastname, antroponym, birthdate, region, settlement, address, position, classesType, userId, institutionUseedCode]);

            connection.end();

            const affectedRows = result[0].affectedRows;
            if (affectedRows > 0){
                return {success: true, data: 'Teacher added successfully'};
            }
            else{
                console.error('No rows affected');
                return {success: false, data: 'No rows affected'};
            }
        }
        catch(error){
            if (connection){
                connection.end();
            }
            console.error(error);
            return {success: false, data: error};
        }
        
    }
}

module.exports = Teacher;