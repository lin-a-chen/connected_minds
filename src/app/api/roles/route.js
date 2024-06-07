import Role from "@/models/Role";


export async function GET() {

    try{
    const result = await Role.findAll();

    if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
    }
    else{
        return new Response(JSON.stringify({success: false, data: 'No roles found'}), {status: 404});
    }
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}