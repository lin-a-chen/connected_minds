import User from "@/models/User";

export async function GET(req) {
    try{
        const { searchParams } = new URL(req.url);
        const emailToken = searchParams.get("emailtoken");
        const userId = searchParams.get("id");

        if (emailToken)
        {
            const result = await User.findByEmailToken(emailToken);
            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'User with this token wasn\'t found'}), {status: 500});
            }
        }
        else if(userId){
            const result = await User.findById(userId);
            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'User wasn\'t found'}), {status: 500});
            }
        }
        else{
            const result = await User.findAll();
            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'No users found'}), {status: 500});
            }
        } 
    }
    catch(error){
    return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function PUT(req) {
    const body = await req.json();
    try{
        const result = await User.updateById(body.id, body.firstname, body.lastname, body.antroponym, body.username, body.email, body.phone_number, body.region, body.settlement, body.district, body.address);
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

export async function PATCH(req) {
    const body = await req.json();
    try{
        const result = await User.activateAccountById(body.id);
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
  