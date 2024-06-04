import {connectToAppDatabase} from "@/lib/db";

class Request{

    static getLocalDatetime = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localTime = new Date(now.getTime() - offset);
        return localTime.toISOString().slice(0, 19).replace('T', ' ');
    };

    static async findAll(){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`SELECT * FROM admin_requests`);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findById(id){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`SELECT * FROM admin_requests WHERE id=?`, [id]);
            await connection.end();
            return {success: true, data: requestData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findByUserId(userId){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`SELECT * FROM admin_requests WHERE user_id=?`, [userId]);
            await connection.end();
            return {success: true, data: requestData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async add(userId, requestType, subject, description, status){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`INSERT INTO admin_requests(user_id, request_type, subject, description, status, created_at, updated_at) ` + 
            `VALUES(?, ?, ?, ?, ?, ?, ?)`, [userId, requestType, subject, description, status, this.getLocalDatetime(), null]);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async updateAll(userId, requestType, subject, description, status, createdAt, updatedAt){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`UPDATE admin_requests SET request_type=?, subject=?, description=?, status=?, updated_at=? WHERE user_id=?`,[requestType, subject, description, status, this.getLocalDatetime(), userId]);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async updateStatus(id, status){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`UPDATE admin_requests SET status=?, updated_at=? WHERE id=?`, [status, this.getLocalDatetime(), id]);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async deleteById(id){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`DELETE FROM admin_requests WHERE id=?`, [id]);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async deleteByUserId(userId){
        const connection = await connectToAppDatabase();
        try{
            const requestData = await connection.query(`DELETE FROM admin_requests WHERE user_id=?`, [userId]);
            await connection.end();
            return {success: true, data: requestData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }
}

module.exports = Request;