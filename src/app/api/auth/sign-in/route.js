import User from "../../../../models/User";
import bcrypt from "bcrypt";
import { createSession } from "@/lib/session";

export async function POST(request) {
    const body = await request.json();
    try{
        const result = await User.findByEmail(body.email);
        if (result.success){
            const user = result.data[0];
            const isPassCorrect = await bcrypt.compare(body.password, user.password);
            if (isPassCorrect){
                await createSession(user.user_id);
                return new Response(JSON.stringify({success: true, data: user.user_id}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'Bad request. Password is incorrect'}), {status: 400});
            }
        }
        else{
            const data = JSON.stringify({success: false, data: 'No such user'});
            return new Response(data, {status: 500});
        }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}