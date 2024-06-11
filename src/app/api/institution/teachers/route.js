import User from "@/models/User";
import Teacher from "@/models/Teacher";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcrypt";
import Role from "@/models/Role";
import { sendVerificationEmail } from "@/lib/mail";

const parseDateString = (dateString) => {
  // Check if the date string is in ISO format
  if (dateString.includes('-')) {
      return new Date(dateString);
  }

  const [day, month, year] = dateString.split('.').map(part => parseInt(part, 10));
  return new Date(year, month - 1, day);
}


const generateUUID = () => {
    return uuidv4();
  };
  

export async function GET(req) {
    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('user-id');

    try{  
        if (!userId){
          const result = await Teacher.findTeacherAndUser();

      if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'No teachers found'}), {status: 404});
      }
        }
        else{
          const result = await Teacher.findByUserId(userId);

      if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'Teacher not found'}), {status: 404});
      }
        }
      
    }
    catch(error){
        console.error(error);
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function DELETE(req) {

    const {searchParams} = new URL(req.url);
    const id = searchParams.get("id");
  
    try{
        const teacherResult = await Teacher.findById(id);
        if (!teacherResult.success){
            return new Response(JSON.stringify({success: true, data: 'Couldn\'t find user to delete'}), {status: 200});
        }

        const userDeleteResult = await User.deleteById(teacherResult.data.user_id);

      if (userDeleteResult.success){
        return new Response(JSON.stringify({success: true, data: 'Teacher was successfully deleted'}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'Couldn\'t delete teacher'}), {status: 500});
      }
    }
    catch(error){
        console.error(error);
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function PUT(req) {
    const body = await req.json();
  
    try{
        const userResult = await User.findByEmail(body.email);

        if (!userResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося знайти користувача за email'}), {status: 500});
        }

        if (!userResult.data){
            return new Response(JSON.stringify({success: false, data: 'Користувача або користувачки з таким email не існує або не знайдено'}), {status: 500});
        }

        const userUpdateResult = await User.updateById(userResult.data.id, body.email, body.phone_number, userResult.data.password, userResult.data.is_activated,
         userResult.data.email_token, userResult.data.email_token_expires_at);

        if (!userUpdateResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося оновити користувача'}), {status: 500});
        }

        const teacherResult = await Teacher.findByUserId(userResult.data.id);
        if (!teacherResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося знайти ученицю/учня'}), {status: 500});
        }

        if (!teacherResult.data){
            return new Response(JSON.stringify({success: false, data: 'Вчительку/вчителя не знайдено або такий акаунт не існує'}), {status: 500});
        }

        const insertDate = parseDateString(body.birthdate);
        const formattedDate = insertDate.toISOString().split('T')[0];
        const teacherUpdateResult = await Teacher.updateById(teacherResult.data.id, body.firstname, body.lastname, body.antroponym, formattedDate, body.country, body.region, body.settlement, body.address, body.position);
        if (!teacherUpdateResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося оновити дані вчительки/вчителя'}), {status: 500});
        }

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 201});

    }
    catch(error){
        console.error(error);
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}




export async function POST(req) {
    const body = await req.json();

    try{

        const emailToken = generateUUID();

        const password = await bcrypt.hash(body.password, 10);

        const userInsertResult = await User.add(body.email, body.phoneNumber, password, emailToken);

        if (!userInsertResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося створити користувача'}), {status: 500});
        }

        const teacherInsertResult = await Teacher.add(body.firstname,
            body.lastname,
            body.antroponym,
            body.birthdate,
            body.country,
            body.region,
            body.settlement,
            body.address,
            body.position,
            userInsertResult.data,
            body.institutionUseedCode);
        if (!teacherInsertResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося зареєструвати вчительку/вчителя'}), {status: 500});
        }

        const roleAssignmentResult = await Role.assignRoleByUserId(userInsertResult.data, "TEACHER", body.institutionUseedCode);
        if (!roleAssignmentResult.success){
            const data = JSON.stringify({success: false, data: 'Помилка реєстрації вчительки/вчителя'});
            return new Response(data, {status: 500});
        }

        await sendVerificationEmail(body.email, emailToken);

        return new Response(JSON.stringify({success: true, data: 'Ура!'}), {status: 201});
    }
    catch(error){
        console.error(error);
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

