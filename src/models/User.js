import {connectToAppDatabase} from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

class User{
    static generateUUID = () => {
        return uuidv4();
    };

    static async findAll(){
        const connection = await connectToAppDatabase();
        try{
            const userData = await connection.query(`SELECT * FROM users`);
            await connection.end();
            return {success: true, data: userData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findById(userId){
        const connection = await connectToAppDatabase();
        try{
            const userData = await connection.query(`SELECT * FROM users WHERE user_id = '${userId}';`);

            await connection.end();
            return {success: true, data: userData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findByEmail(email){
        const connection = await connectToAppDatabase();
        try{
            const userData = await connection.query(`SELECT * FROM users WHERE email = '${email}'`);
            await connection.end();
            return {success: true, data: userData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async getUserRolesByUserId(userId){
        const connection = await connectToAppDatabase();
        try{
            const userRoles = await connection.query(`SELECT * FROM user_roles
            WHERE user_id = '${userId}';`);
            await connection.end();
            return {success: true, data: userRoles[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async add(email, phoneNumber, firstname, lastname, paternalName, password) {
        const connection = await connectToAppDatabase();
        const user_id = this.generateUUID();        

        try{
            const sql = `INSERT INTO users(user_id, email, phone_number, firstname, lastname, paternal_name, password) VALUES('${user_id}', '${email}', '${phoneNumber}', '${firstname}', '${lastname}', '${paternalName}', '${password}')`;
            const result = await connection.query(sql);

            const affectedRows = result[0].affectedRows;
            await connection.end();
            if (affectedRows > 0){
                return {success: true, data: user_id};
            }
            else{
                console.error('No rows affected');
                return {success: false, data: 'No rows affected'};
            }
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
        
    }

    static async updateById(userId, firstname, lastname, antroponym, username, email, phoneNumber, region, settlement, district, address) {
        const connection = await connectToAppDatabase();

        try{        
            const sql = `UPDATE users SET firstname=?, lastname=?, antroponym=?, username=?, email=?, phone_number=?, region=?, settlement=?, district=?, address=?
            WHERE user_id=?;`;
            console.log('sql', sql);
            const result = await connection.query(sql, [firstname, lastname, antroponym, username, email, phoneNumber, region, settlement, district, address, userId]);

            const affectedRows = result[0].affectedRows;
            await connection.end();
            if (affectedRows > 0){
                return {success: true, data: userId};
            }
            else{
                console.error('No rows affected');
                return {success: false, data: 'No rows affected'};
            }
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
        
    }
}

module.exports = User;