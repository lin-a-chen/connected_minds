import User from "@/models/User";
import Role from "@/models/Role";

export async function POST(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.email);
        if (!userResult.success){
            return new Response(JSON.stringify({ success: false, data: "Не вийшло знайти користувача з такою поштою" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const userRolesResult = await Role.findByUserId(userResult.data.id);

        if (!userRolesResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло перевірити, чи в користувача вже є роль'}), {status: 500});
        }

        if (userRolesResult.data && userRolesResult.data.user_id !== ''){
            return new Response(JSON.stringify({success: false, data: 'Цей акаунт вже зайнятий іншою роллю і не може бути адміністратором'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: 'Все супер!'}), {status: 200});

    }catch(error){
        console.error(error);
        return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}