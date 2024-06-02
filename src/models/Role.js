import {connectToAppDatabase} from "../lib/db";

class Role{

    static async findAllUserRoles(){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM user_roles`);
            await connection.end();
            return {success: true, data: roleData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findInfoOnUserRoles(){
        const connection = await connectToAppDatabase();
        try{
            const result = await connection.query(`SELECT user_roles.*, roles.role_name, users.username, users.email, institutions.fullname
            FROM user_roles
            INNER JOIN roles ON roles.id = user_roles.role_id
            INNER JOIN users ON users.id = user_roles.user_id
            LEFT JOIN institutions ON institutions.useed_code = user_roles.institution_useed_code;`);
            await connection.end();
            return {success: true, data: result[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async findAll(){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM roles`);
            await connection.end();
            return {success: true, data: roleData[0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

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

    static async findByUserId(userId){
        const connection = await connectToAppDatabase();
        try{
            const roleData = await connection.query(`SELECT * FROM user_roles WHERE user_id='${userId}'`);
            console.log('roleData', roleData);

            await connection.end();
            return {success: true, data: roleData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }

    static async assignRoleByUserId(userId, role, useedCode){
        const connection = await connectToAppDatabase();
        console.log('assignRoleData', userId, role, useedCode)

        try{
            const roleIdResult = await connection.query(`SELECT * FROM roles WHERE role_name='${role}'`);
            console.log('roleIdResult', roleIdResult)

            if (roleIdResult){
                const assignRoleResult = await connection.query(`INSERT INTO user_roles(user_id, role_id, institution_useed_code) values(?, ?, ?)`, [userId, roleIdResult[0][0].id, useedCode]);
                console.log('assignRoleResult', assignRoleResult)

                if (assignRoleResult){
                    await connection.end();
                    return {success: true, data: assignRoleResult};
                }
            }
            else{
                await connection.end();
                console.error(error);
                return {success: false, data: 'Couldn\'t find role id by role name'};
            }
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
            const roleData = await connection.query(`DELETE FROM user_roles WHERE id='${id}'`);

            await connection.end();
            return {success: true, data: roleData[0][0]};
        }
        catch(error){
            await connection.end();
            console.error(error);
            return {success: false, data: error};
        }
    }
}

module.exports = Role;