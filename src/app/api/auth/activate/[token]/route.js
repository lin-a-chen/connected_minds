import User from "@/models/User";

export async function GET(req) {
    try{
        const token = req.nextUrl.pathname.split('/').pop();
        const user = await User.findByEmailToken(token);

        const currentTime = new Date();
        if (new Date(user.email_token_expires_at) < currentTime) {
            return new Response(JSON.stringify({ success: false, data: 'Invalid or expired activation token.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        else{
            const activatedUser = await User.activateAccountById(user.data.id);
            if (activatedUser){
                console.log('activatedUser', activatedUser)
    
                return new Response(JSON.stringify({ success: true, data: 'Account has been activated.' }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
            else {
                return new Response(JSON.stringify({ success: false, data: 'Invalid or expired activation token.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
                });
            }
        }        
    }
    catch(error){
        console.log(error);
        return new Response(JSON.stringify({ sucess: false, data: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            });
    }

};