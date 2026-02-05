import Role from "@/models/Role";
import User from "@/models/User";
import Institution from "@/models/Institution";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const reqmode = searchParams.get('reqmode');
    let result;
    try{
        if (reqmode === 'compr'){
            result = await Role.findInfoOnUserRoles();
        }
        else{
            result = await Role.findAll();
        }

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'No user roles found'}), {status: 404});
        }
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function POST(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.email);
        if (!userResult.success){
            return new Response(JSON.stringify({success: false, data: 'Помилка знаходження користувача за email'}), {status: 500});
        }

        const userRolesAddResult = await Role.assignRoleByUserId(userResult.data.id, body.userRole, body.useedCode);
        if (!userRolesAddResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло призначити роль'}), {status: 500});
        }
        else{
            return new Response(JSON.stringify({success: true, data: 'Роль додано успішно'}), {status: 201});
        }
   
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}

export async function DELETE(req) {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    try{
        const result = await Role.deleteById(id);
        if (!result.success){
            return new Response(JSON.stringify({success: false, data: 'Error deleting user role'}), {status: 500});
        }
            
        return new Response(JSON.stringify({success: true, data: 'Role deleted successfully'}), {status: 201});
   
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}