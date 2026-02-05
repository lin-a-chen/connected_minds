import User from "@/models/User";

export async function POST(req) {
    const body = await req.json();
    try{
        const userResult = await User.findByEmail(body.email);
        if (!userResult.success){
            return new Response(JSON.stringify({ success: false, data: "Не вийшло перевірити чи користувач існує" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (userResult.data && userResult.data.length > 0){
            return new Response(JSON.stringify({success: false, data: 'Користувач з такою поштою вже існує'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: 'Все супер!'}), {status: 200});

    }catch(error){
        console.error(error);
        return new Response(JSON.stringify({success: false, data: error}), {status: 500});
    }
}