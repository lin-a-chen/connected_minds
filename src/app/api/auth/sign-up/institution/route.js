import bcrypt from 'bcrypt'
import User from '@/models/User'
import { sendVerificationEmail } from '@/lib/mail';
import { v4 as uuidv4 } from 'uuid';
import Institution from '@/models/Institution';

const generateUUID = () => {
    return uuidv4();
};

export const POST = async (req) => {
  const body = await req.json();
  try {
    const user = await User.findByEmail(body.principalEmail);
    if (!user.success){
        return new Response(JSON.stringify({success: false, data: "User does not exist or not found" }), {
        status: 500});
    }
    else{
        const isPassCorrect = await bcrypt.compare(body.principalPassword, user.data.password);
        if (isPassCorrect){
            const emailToken = generateUUID();
            const principalFullname = body.lastname + ' ' + body.firstname + ' ' + body.antroponym;
            const updateInstitution = await Institution.updateByUseed(body.useedCode,
                body.fullname,
                body.institutionType,
                body.shortname,
                body.ownershipForm,
                body.coatsuuCode,
                body.region,
                body.settlement,
                body.address,
                body.governingBodyInChargeOfEducation,
                body.phoneNumber,
                body.email,
                body.website,
                principalFullname,
                body.principalEmail,
                body.principalPassword,
                user.data.user_id
            );
            if (updateInstitution.success){
                console.log("UPdated successfully")
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
    // const institutionAddition
    // const result = await Institu
    // await sendVerificationEmail(email, emailToken);
    return new Response(JSON.stringify({success: true, data: 'User has been created and verification email sent.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({success: false, data: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}