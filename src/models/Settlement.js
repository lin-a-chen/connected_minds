import { connectToAppDatabase } from "@/lib/db";

class Settlement{
    static async findAllRegions() {
        try{
            const connection = await connectToAppDatabase();
            const sql = `SELECT DISTINCT region FROM settlements`;
            const result = await connection.query(sql);

            await connection.end();

            if (result){
                const regions = result[0].map(el => el.region);
                return {success: true, data: regions};
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

    static async findSettlementsByRegion(region) {
        try{
            const connection = await connectToAppDatabase();
            const sql = `SELECT * FROM settlements WHERE region="${region}"`;
            const result = await connection.query(sql);
            await connection.end();

            if (result){
                const settlements = result[0];

                return {success: true, data: settlements};
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

module.exports = Settlement;