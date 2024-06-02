import {connectToAppDatabase} from "@/lib/db";
import { v4 as uuidv4 } from 'uuid';

class User{
    static generateUUID = () => {
        return uuidv4();
    };

    static formatDateToMySQL = (date) => {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    static getLocalDatetime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - offset);
        return localTime.toISOString().slice(0, 19).replace('T', ' ');
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
            const userData = await connection.query(`SELECT * FROM users WHERE id=?`, [userId]);
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
            return {success: true, data: userData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findByEmailToken(token){
        const connection = await connectToAppDatabase();
        try{
            const userData = await connection.query(`SELECT * FROM users WHERE email_token = ?`, [token]);
            await connection.end();
            return {success: true, data: userData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async activateAccountById(userId){
        const connection = await connectToAppDatabase();
        try{
            const userData = await connection.query(`UPDATE users SET email_token = ?, is_activated = ? WHERE id = ?`, [null, true, userId]);
            await connection.end();
            return {success: true, data: userData[0][0]};
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

    static async add( username, email, phoneNumber, password, emailToken) {
        const connection = await connectToAppDatabase();
        const createdAt = this.getLocalDatetime();
        const userId = this.generateUUID();
        const tokenExpiresAt = new Date();
        tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24);
        const formattedExpirationDate = this.formatDateToMySQL(tokenExpiresAt);
        try{
            const sql = `INSERT INTO users(id, username, email, phone_number, password, is_activated, created_at, email_token, email_token_expires_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = await connection.query(sql, [userId, username, email, phoneNumber, password, 0, createdAt, emailToken, formattedExpirationDate]);
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

    static async updateById(userId, username, email, phoneNumber, password, isActivated, createdAt, emailToken, emailTokenExpiresAt) {
        const connection = await connectToAppDatabase();

        try{        
            const sql = `UPDATE users SET username=?, email=?, phone_number=?, password=?, is_activated=?, email_token=?, email_token_expires_at=?
            WHERE id=?;`;
            console.log('sql', sql);
            const result = await connection.query(sql, [username, email, phoneNumber, password, isActivated, createdAt, emailToken, emailTokenExpiresAt, userId]);

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

    static async updateTokenById(userId, token) {
        const connection = await connectToAppDatabase();

        try{        
            const sql = `UPDATE users SET ?
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