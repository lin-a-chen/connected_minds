import { sendMail } from "@/lib/mail";

export async function POST(req) {
    const body = await req.json();
    console.log('body', body);

    try {
        await sendMail(body.email, body.heading, body.ifWrongUserMessage, body.text);
        return new Response(JSON.stringify({success: true, data: 'Email sent successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch(error){
        console.log(error);
        return new Response(JSON.stringify({success: false, data: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        }
    )};
}