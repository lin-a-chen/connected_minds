import Request from "@/models/Request";
import User from "@/models/User";
import Role from "@/models/Role";

export async function POST(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.userEmail);
        if (!userResult.success){
            return new Response(JSON.stringify({ success: false, data: "Не вийшло знайти користувача з такою поштою" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
                
        if (body.institutionAdminUserId && body.institutionAdminUserId.length > 0){
            return new Response(JSON.stringify({success: false, data: 'У даного навчального закладу вже є адміністратор'}), {status: 500});
        }

        const userRolesResult = await Role.findByUserId(body.institutionAdminUserId);
        if (!userRolesResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло перевірити, чи в користувача вже є роль'}), {status: 500});
        }

        console.log('userRolesResult', userRolesResult);


        if (userRolesResult.data && userRolesResult.data.user_id !== ''){
            return new Response(JSON.stringify({success: false, data: 'Цей акаунт вже зайнятий іншою роллю і не може бути адміністратором'}), {status: 500});
        }

        console.log('userResult.data.user_id', userResult.data.user_id);


        const requestResult = await Request.findByUserId(body.institutionAdminUserId);
        console.log('requestResult', requestResult);

        if (!requestResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло перевірити чи у вас вже є заявки'}), {status: 500});
        }
        if (requestResult.data && requestResult.data.request_type === 'ADD_INSTITUTION'){
            return new Response(JSON.stringify({success: false, data: 'Ваша заявка на реєстрацію навчального закладу вже розглядається'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: 'Все супер!'}), {status: 200});

    }catch(error){
        console.error(error);
        return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}