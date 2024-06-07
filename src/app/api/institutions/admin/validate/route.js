import Institution from "@/models/Institution";
import User from "@/models/User";

export const POST = async (req) => {
    const body = await req.json();

    try{
        const institutionResult = await Institution.findByUseed(body.useedCode);

        if (!institutionResult.success){
            return new Response(JSON.stringify({success: false, data: 'Помилка пошуку навчального закладу'}), {status: 500});
        }

        if (!institutionResult.data){
            return new Response(JSON.stringify({success: false, data: 'Не знайдено навчальний заклад з таким кодом ЄДЕБО'}), {status: 404});
        }

        const userResult = await User.findByEmail(body.email);
        if (!userResult.success){
            return new Response(JSON.stringify({success: false, data: 'Помилка перевірки зареєстрованості користувача'}), {status: 500});
        }

        if (userResult.data){
            return new Response(JSON.stringify({success: false, data: 'Такий користувач вже існує'}), {status: 405});
        }

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 201});

    }catch(error){
        console.error(error);
        return new Response(JSON.stringify({success: false, data: 'Помилка на сервері'}), {status: 500});
    }
}