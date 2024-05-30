import { connectToAppDatabase } from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';
import User from "./User";

class Schoolchild{
    static generateUUID = () => {
        return uuidv4();
    };

    static async add(
        firstname, lastname, antroponym, birthdate, classNumber, classLetter, region, settlement, address, userId, institutionUseedCode) {
        try{
            const schoolchildId = this.generateUUID();
            const connection = await connectToAppDatabase();

            const sql = `INSERT INTO schoolchildren(id, firstname, lastname, antroponym, birthdate, class_number, class_letter, region, settlement, address, id, institution_useed_code) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = await connection.query(sql, [schoolchildId, firstname, lastname, antroponym, 
                birthdate, classNumber, classLetter, 
                region, settlement, address, userId, 
                institutionUseedCode]);

            connection.end();

            const affectedRows = result[0].affectedRows;
            if (affectedRows > 0){
                return {success: true, data: 'User created successfully (schoolchild)'};
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

module.exports = Schoolchild;