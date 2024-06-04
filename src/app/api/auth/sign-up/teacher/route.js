import Teacher from "@/models/Teacher";
import User from "@/models/User";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import { sendVerificationEmail } from "@/lib/mail";

const generateUUID = () => {
  return uuidv4();
};

const transliterate = (word) => {
  const alphabetLetter = {    'зг' : 'zgh',
  'Зг' : 'Zgh',
  'А':'A',
  'а':'a',
  'Б':'B',
  'б':'b',
  'В':'V',
  'в':'v',
  'Г':'H',
  'г':'h',
  'Ґ':'G',
  'ґ':'g',
  'Д':'D',
  'д':'d',
  'Е':'E',
  'е':'e',
  'Є':'Ye',
  'є':'ie',
  'Ж':'Zh',
  'ж':'zh',
  'З':'Z',
  'з':'z',
  'И':'Y',
  'и':'y',
  'І':'I',
  'і':'i',
  'Ї':'Yi',
  'ї':'i',
  'Й':'Y',
  'й':'i',
  'К':'K',
  'к':'k',
  'Л':'L',
  'л':'l',
  'М':'M',
  'м':'m',
  'Н':'N',
  'н':'n',
  'О':'O',
  'о':'o',
  'П':'P',
  'п':'p',
  'Р':'R',
  'р':'r',
  'С':'S',
  'с':'s',
  'Т':'T',
  'т':'t',
  'У':'U',
  'у':'u',
  'Ф':'F',
  'ф':'f',
  'Х':'Kh',
  'х':'kh',
  'Ц':'Ts',
  'ц':'ts',
  'Ч':'Ch',
  'ч':'ch',
  'Ш':'Sh',
  'ш':'sh',
  'Щ':'Shch',
  'щ':'shch',
  'Ю':'Yu',
  'ю':'iu',
  'Я':'Ya',
  'я':'ia',
  'ь':'',
  "'":''};
  let answer = '';
 for (let i in word){
   if (word.hasOwnProperty(i)) {
     if (alphabetLetter[word[i]] === undefined){
       answer += word[i];
     } else {
       answer += alphabetLetter[word[i]];
     }
   }
  }
 return answer;
}

const generateUsername = (firstname, lastname, antroponym, institutionUseedCode, birthDate) => {
  return 'teacher_' + transliterate(lastname.toLowerCase()) + '_' + transliterate(firstname[0].toLowerCase()) +  transliterate(antroponym[0].toLowerCase()) + '_' + institutionUseedCode + '_' + birthDate.slice(0, 4);
};

export async function POST(req) {
  const body = await req.json();

  console.log("body", body)
  const emailToken = generateUUID();
  
  try{
    const password = await bcrypt.hash(body.password, 10);
    const username = generateUsername(body.firstname, body.lastname, body.antroponym, body.institution.useed_code, body.birthDate);

    const userInsertResult =  await User.add(username, body.email, body.phoneNumber, password, emailToken);
    if (userInsertResult.success){
      const teacherInsertResult = await Teacher.add(
      body.firstname, body.lastname, body.antroponym, 
      body.birthDate, body.region, body.settlement, 
      body.address, body.position, body.classesType, userInsertResult.data, 
      body.institution_useed_code);

      if(teacherInsertResult.success){
          await sendVerificationEmail(body.email, emailToken);
          const data = JSON.stringify({success: true, data: 'Teacher\'s account created successfully'});
          return new Response(data, {status: 201});
      }
      else{
          console.error(teacherInsertResult)
          const data = JSON.stringify({success: false, data: 'Couldn\'t add new teacher'});
          return new Response(data, {status: 500});
      }
    }
    else{
      const data = JSON.stringify({success: false, data: 'Couldn\'t add new user'});
      return new Response(data, {status: 500});
    }

  }
  catch(error){
    console.error(error);
    const data = JSON.stringify({success: false, data: 'Internal server error'});
    return new Response(data, {status: 500});
  }
}