import { connectToAppDatabase } from "@/lib/db";

class Institution{

    static async findAll(){
        const connection = await connectToAppDatabase();

        try{
            const sql = `SELECT * FROM institutions`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                const institutions = result[0];
                return {success: true, data: institutions};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async findAllPending(){
        const connection = await connectToAppDatabase();

        try{
            const sql = `SELECT * FROM pending_institutions`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                return {success: true, data: result[0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async findByUseed(useed) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `SELECT * FROM institutions WHERE useed_code=?`;
            const result = await connection.query(sql, [useed]);
            await connection.end();

            console.log('reserel', result)

            if (result){
                const institution = result[0];
                return {success: true, data: institution[0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async findPendingByUseedCode(useedCode) {
        const connection = await connectToAppDatabase();
        try{
            const sql = `SELECT * FROM pending_institutions WHERE useed_code="${useedCode}"`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                return {success: true, data: result[0][0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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


    static async deleteByUseed(useed) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `DELETE FROM institutions WHERE useed_code="${useed}"`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                const institution = result[0];
                return {success: true, data: institution[0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async deletePendingByAdminUserId(adminUserId) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `DELETE FROM pending_institutions WHERE admin_user_id="${adminUserId}"`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                const institution = result[0];
                return {success: true, data: institution[0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async deletePendingById(id) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `DELETE FROM pending_institutions WHERE id="${id}"`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                const institution = result[0];
                return {success: true, data: institution[0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async updateByUseed (
        useedCode,
        fullname,
        institutionType,
        shortname,
        ownershipForm,
        coatsuuCode,
        region,
        settlement,
        address,
        governingBodyInChargeOfEducation,
        phoneNumber,
        email,
        website,
        adminUserFullname,
        adminUserUserId
      ) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `UPDATE institutions SET 
            admin_user_fullname=?, admin_user_id=?, 
            address=?, coatsuu_code=?, 
            email=?, fullname=?, governing_body_in_charge_of_education=?, 
            institution_type=?, ownership_form=?, phone_number=?, 
            region=?, settlement=?, shortname=?, website=?
            WHERE useed_code=?`;
            const result = await connection.query(sql, [
                adminUserFullname, adminUserUserId,
                address, coatsuuCode,
                email, fullname,
                governingBodyInChargeOfEducation,
                institutionType, ownershipForm,
                phoneNumber, region,
                settlement, shortname,
                website, useedCode
            ]);
            await connection.end();

            if (result){
                if (result[0].affectedRows){
                    return {success: true, data: result[0]};
                }
                else{
                    return {success: false, data: result[0]}
                }
                
            }
            else{
                console.error('No data updated');
                return {success: false, data: 'No data updated'};
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

    static async updatePendingByUseed (
        useedCode,
        fullname,
        institutionType,
        shortname,
        ownershipForm,
        coatsuuCode,
        region,
        settlement,
        address,
        governingBodyInChargeOfEducation,
        phoneNumber,
        email,
        website,
        adminUserFullname,
        adminUserUserId
      ) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `UPDATE pending_institutions SET 
            admin_user_fullname=?, admin_user_id=?, 
            address=?, coatsuu_code=?, 
            email=?, fullname=?, governing_body_in_charge_of_education=?, 
            institution_type=?, ownership_form=?, phone_number=?, 
            region=?, settlement=?, shortname=?, website=?
            WHERE useed_code=?`;
            const result = await connection.query(sql, [
                adminUserFullname, adminUserUserId,
                address, coatsuuCode,
                email, fullname,
                governingBodyInChargeOfEducation,
                institutionType, ownershipForm,
                phoneNumber, region,
                settlement, shortname,
                website, useedCode
            ]);
            await connection.end();

            if (result){
                if (result[0].affectedRows){
                    return {success: true, data: result[0]};
                }
                else{
                    return {success: false, data: result[0]}
                }
                
            }
            else{
                console.error('No data updated');
                return {success: false, data: 'No data updated'};
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

    static async addPending (
        useedCode,
        fullname,
        institutionType,
        shortname,
        ownershipForm,
        coatsuuCode,
        region,
        settlement,
        address,
        governingBodyInChargeOfEducation,
        phoneNumber,
        email,
        website,
        adminUserFullname,
        adminUserId
      ) {
        const connection = await connectToAppDatabase();
        console.log('adminUserId', adminUserId)

        try{
            const sql = `INSERT INTO pending_institutions(fullname, useed_code, ` +
                `shortname, state, institution_type, ownership_form, coatsuu_code, ` +
                `region, settlement, address, governing_body_in_charge_of_education, ` + 
                `phone_number, email, website, admin_user_fullname, admin_user_id) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

            const result = await connection.query(sql, [fullname, useedCode, shortname,
                'працює', institutionType, ownershipForm, coatsuuCode, region, settlement, address,
                governingBodyInChargeOfEducation, phoneNumber, email, website, adminUserFullname, adminUserId
            ]);
            await connection.end();

            if (result){
                console.log(result[0].info);
                if (result[0].affectedRows){
                    return {success: true, data: result[0]};
                }
                else{
                    return {success: false, data: result[0].info}
                }
                
            }
            else{
                console.error('No data updated');
                return {success: false, data: 'No data updated'};
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

    static async findPendingByUserId(user_id){
        const connection = await connectToAppDatabase();

        try{
            const sql = `SELECT * FROM pending_institutions WHERE admin_user_id='${user_id}'`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                console.log('result', user_id);

                const institutions = result[0][0];
                return {success: true, data: institutions};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

    static async deletePendingByUseed(useed_code){
        const connection = await connectToAppDatabase();

        try{
            const sql = `DELETE FROM pending_institutions WHERE useed_code='${useed_code}'`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                return {success: true, data: result[0][0]};
            }
            else{
                console.error('No data selected');
                return {success: false, data: 'No data selected'};
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

module.exports = Institution;