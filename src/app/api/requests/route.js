import Request from "@/models/Request";
import User from "@/models/User";
import Institution from "@/models/Institution";
import bcrypt from "bcrypt";

export async function GET() {
    try{
        const result = await Request.findAll();

        if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
        return new Response(JSON.stringify({success: false, data: 'No requests found'}), {status: 500});
        }
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function POST(req) {

    const body = await req.json();
  try {
    const user = await User.findByEmail(body.principalEmail);
    if (!user.success){
        return new Response(JSON.stringify({success: false, data: "User does not exist or not found" }), {
        status: 500});
    }
    else{
        const isPassCorrect = await bcrypt.compare(body.principalPassword, user.data[0].password);
        if (isPassCorrect){
            const principalFullname = body.lastname + ' ' + body.firstname + ' ' + body.antroponym;
            const institutionAddResult = await Institution.addPending(body.useedCode, body.fullname, body.institutionType, body.shortname, body.ownershipForm,
                body.coatsuuCode, body.region, body.settlement, body.address, body.governingBodyInChargeOfEducation,
                body.phoneNumber, body.email, body.website, principalFullname, body.principalUserId);

            if (institutionAddResult.success){
                const result = await Request.add(user.user_id, 'ADD_INSTITUTION', 'Додавання нового навчального закладу', `Від користувача ${user.username} надійшло прохання про додавання навчального закладу та надання прав адміністратора`, 'pending');
                if (result.success){
                    return new Response(JSON.stringify({success: true, data: 'Request added successfully' }), {
                        status: 201,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
                else{
                    return new Response(JSON.stringify({success: false, data: 'Couldn\'t add to requests' }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    });
                }
            }
            else{
                return new Response(JSON.stringify({success: false, data: 'Couldn\'t add to pending_institutions' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        }
        else{
            console.error('Password is incorrect');
            return new Response(JSON.stringify({success: false, data: 'Password is incorrect' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({success: false, data: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}