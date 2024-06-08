import Class from "@/models/Class";
import Schedule from "@/models/Schedule";
import User from "@/models/User";
import Teacher from "@/models/Teacher";


export async function GET(req) {

    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");

    try{
        if (id){
            const result = await Class.findById(id);

            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'No classes found'}), {status: 500});
            }
        }
        else{
            const result = await Class.findAll();

            if (result.success){
                return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'No classes found'}), {status: 500});
            }
        }
    }
    catch(error){
        console.error(error);
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

        const findUserResult = await User.findByEmail(body.email);
        if (!findUserResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося перевірити чи такий користувач існує'}), {status: 500});
        }

        if (!findUserResult.data){
            return new Response(JSON.stringify({success: false, data: 'Користувача з таким email не знайдено, або не існує'}), {status: 404});
        }

        const findTeacherResult = await Teacher.findByUserId(findUserResult.data.id);
        if (!findTeacherResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося перевірити чи такий вчитель існує'}), {status: 500});
        }

        if (!findTeacherResult.data){
            return new Response(JSON.stringify({success: false, data: 'Вчителя з таким email не знайдено, або не існує'}), {status: 404});
        }

        const findClassByTeacherResult = await Class.findByTeacherId(body.name);
        if (!findClassByTeacherResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло перевірити чи такого класного керівника вже призначено'}), {status: 500});
        }

        if (findClassByTeacherResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий класний керівник вже є в іншому класі'}), {status: 500});
        }

        if (findClassResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий клас вже існує'}), {status: 500});
        }

        const result = await Class.add(body.name, findTeacherResult.data.id);
        if (!result.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло додати клас'}), {status: 500});
        }

        const scheduleResult = await Schedule.addWeekForClass(result.data);
        if (!scheduleResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вийшло додати розклад для класу'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
    }
    catch(error){
        console.error(error);
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
        console.error(error);
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}
