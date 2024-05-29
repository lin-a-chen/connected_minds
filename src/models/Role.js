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
}

module.exports = Role;