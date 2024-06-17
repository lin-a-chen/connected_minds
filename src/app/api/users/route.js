import User from "@/models/User";
import bcrypt from "bcrypt";



export async function GET(req) {
    try{
        const { searchParams } = new URL(req.url);
        const emailToken = searchParams.get("emailtoken");
        const userId = searchParams.get("id");
        const email = searchParams.get('email');

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
        else if(email){
            const result = await User.findByEmail(email);

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
        if (!body.password && !body.oldPassword){
            const result = await User.activateAccountById(body.id);
            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'No users found'}), {status: 500});
            }
        }
        else if (body.password && body.oldPassword){

            const findUser = await User.findById(body.id);
            if (!findUser.success){
                return new Response(JSON.stringify({success: false, data: "Не вдалося знайти користувача"}), {status: 500});
            }

            if (!findUser.data){
                return new Response(JSON.stringify({success: false, data: "Користувача не знайдено"}), {status: 404});
            }

            const isPassCorrect = bcrypt.compare(body.oldPassword, findUser.data.password);

            if (!isPassCorrect){
                return new Response(JSON.stringify({success: false, data: "Пароль невірний"}), {status: 405});
            }

            const hashedPass = await bcrypt.hash(body.password, 10);

            const result = await User.changePassword(body.id, hashedPass);

            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'Не вдалося оновити пароль'}), {status: 500});
            }
        }
        
        
    }
    catch(error){
    return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}
  