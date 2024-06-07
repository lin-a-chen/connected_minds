import Class from "@/models/Class";

export async function GET() {

    try{
        const result = await Class.findAll();

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'No classes found'}), {status: 500});
        }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}


export async function POST(req) {
    const body = await req.json();
    try{
        const findClassResult = await Class.findByName(body.name);
        if (!findClassResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло перевірити чи клас існує'}), {status: 500});
        }

        if (findClassResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий клас вже існує'}), {status: 500});
        }

        const result = await Class.add(body.name);
        if (!result.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло додати клас'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function DELETE(req) {
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    try{
        const result = await Class.deleteById(id);
        if (!result.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло видалити клас'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}
