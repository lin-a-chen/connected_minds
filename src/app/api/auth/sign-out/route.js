import { deleteSession } from "@/app/lib/session";

export async function DELETE() {
    try{
        deleteSession();
        const data = JSON.stringify({success: true, data: 'Signing out went fine :3'});
        return new Response(data, {status: 200});
    }
    catch(error){
        const data = JSON.stringify({success: false, data: 'Internal server error'});
        return new Response(data, {status: 500});
    }
    
}