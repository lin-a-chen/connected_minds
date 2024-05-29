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

    static async findByUseed(useed) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `SELECT * FROM institutions WHERE useed_code="${useed}"`;
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
        principalFullname,
        principalUserId
      ) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `UPDATE institutions SET 
            principal_fullname=?, principal_user_id=?, 
            address=?, coatsuu_code=?, 
            email=?, fullname=?, governing_body_in_charge_of_education=?, 
            institution_type=?, ownership_form=?, phone_number=?, 
            region=?, settlement=?, shortname=?, website=?
            WHERE useed_code=?`;
            const result = await connection.query(sql, [
                principalFullname, principalUserId,
                address, coatsuuCode,
                email, fullname,
                governingBodyInChargeOfEducation,
                institutionType, ownershipForm,
                phoneNumber, region,
                settlement, shortname,
                website, useedCode
            ]);
            await connection.end();
            console.log('result', result);

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
        principalFullname,
        principalUserId
      ) {
        const connection = await connectToAppDatabase();

        try{
            const sql = `INSERT INTO pending_institutions(principal_fullname, principal_user_id, ` +
                `address, coatsuu_code, ` +
                `email, fullname, governing_body_in_charge_of_education, ` + 
                `institution_type, ownership_form, phone_number, ` +
                `region, settlement, shortname, website, useed_code, state) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const result = await connection.query(sql, [
                principalFullname, principalUserId,
                address, coatsuuCode,
                email, fullname,
                governingBodyInChargeOfEducation,
                institutionType, ownershipForm,
                phoneNumber, region,
                settlement, shortname,
                website, useedCode, 'працює'
            ]);
            await connection.end();
            console.log('result', result);

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


}

module.exports = Institution;