import Schedule from "@/models/Schedule";
import Class from "@/models/Class";

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const className = searchParams.get('class');
    try{
        if (className){
            const classResult = await Class.findByName(className);

        if (!classResult.success){
            return new Response(JSON.stringify({success: false, data: 'Class not found'}), {status: 404});
        }
        const result = await Schedule.findByClassId(classResult.data.id);

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'Schedule not found'}), {status: 404});
        }
        }
        else{
            const result = await Schedule.findAll();

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'Schedule not found'}), {status: 404});
        }
        }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}