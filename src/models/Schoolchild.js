import { connectToAppDatabase } from "../lib/db";
import { v4 as uuidv4 } from 'uuid';
import User from "./User";

class Schoolchild{
    static generateUUID = () => {
        return uuidv4();
    };

    static async add(email, phoneNumber, firstname, lastname, paternalName, password, birthdayDate, classNumber, classLetter) {
        const schoolchildId = this.generateUUID();
        const connection = await connectToAppDatabase();
        try{
            const userInsertResult = await User.add(email, phoneNumber, firstname, lastname, paternalName, password);
            if (userInsertResult.success){
                const userId = userInsertResult.data;
                const sql = `INSERT INTO schoolchildren(schoolchild_id, class_letter, class_number, birthday_date, user_id) VALUES('${schoolchildId}', '${classLetter}', ${+classNumber}, '${birthdayDate}', '${userId}')`;
                const result = await connection.query(sql);
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