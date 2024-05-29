import Schoolchild from "../../../../models/Schoolchild";
import bcrypt from "bcrypt";

export async function POST(request) {
  const body = await request.json();
  try{
    const password = await bcrypt.hash(body.password, 10);
    const result = await Schoolchild.add(body.email, body.phoneNumber, body.firstname,
      body.lastname, body.paternalName, password, body.birthdayDate,
       body.classNumber, body.classLetter);

    if (result.success){
      const data = JSON.stringify({success: true});
      return new Response(data, {status: 200});
    }
    else{
      const data = JSON.stringify({success: false, data: 'Internal server error'});
      return new Response(data, {status: 500});
    }
  }
  catch(error){
    const data = JSON.stringify({success: false, data: 'Internal server error'});
    return new Response(data, {status: 500});
  }
}