import User from "@/models/User";

export async function GET() {
    try{
        const result = await User.findAll();
        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'No users found'}), {status: 500});
        }
    }
    catch(error){
    return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function PUT(req) {
    const body = await req.json();
    try{
        const result = await User.updateById(body.user_id, body.firstname, body.lastname, body.antroponym, body.username, body.email, body.phone_number, body.region, body.settlement, body.district, body.address);
        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'No users found'}), {status: 500});
        }
    }
    catch(error){
    return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}
  