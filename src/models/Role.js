import {connectToAppDatabase} from "../lib/db";

class Role{

    static async findById(roleId){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM roles WHERE role_id='${roleId}'`);
            await connection.end();
            return {success: true, data: roleData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findByName(roleName){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM roles WHERE role_name='${roleName}'`);
            await connection.end();
            return {success: true, data: roleData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findByIdAndUserId(roleId, userId){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM user_roles WHERE role_id='${roleId}' AND user_id='${userId}'`);
            await connection.end();
            return {success: true, data: roleData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }
}

module.exports = Role;