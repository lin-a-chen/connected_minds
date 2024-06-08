import Request from "@/models/Request";
import User from "@/models/User";
import Institution from "@/models/Institution";
import bcrypt from "bcrypt";
import Role from "@/models/Role";

export async function GET() {
    try{
        const result = await Request.findAll();

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({ success: false, data: "Request does not exist or not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
              });
        }
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export async function POST(req) {
  const body = await req.json();
    try {
      if (body.request_type === 'ADD_INSTITUTION'){      
        const user = await User.findByEmail(body.adminUserEmail);
        if (!user.success) {
          return new Response(JSON.stringify({ success: false, data: "User does not exist or not found" }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
    
        const isPassCorrect = await bcrypt.compare(body.adminUserPassword, user.data.password);
        if (!isPassCorrect) {
          console.error('Password is incorrect');
          return new Response(JSON.stringify({ success: false, data: 'Password is incorrect' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          });
        }
    
        const adminUserFullname = `${body.lastname} ${body.firstname} ${body.antroponym}`;
    
        const institutionAddResult = await Institution.addPending(
          body.useedCode,
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
          adminUserFullname,
          user.data.id
        );
    
        if (!institutionAddResult.success) {
          throw new Error('Couldn\'t add to pending_institutions');
        }
    
        const requestResult = await Request.add(
          user.data.id,
          'ADD_INSTITUTION',
          'Додавання нового навчального закладу',
          `Від користувача надійшло прохання про додавання навчального закладу та надання прав адміністратора`,
          'pending'
        );
    
        if (!requestResult.success) {
          throw new Error('Couldn\'t add to requests');
        }
      }
      else if (body.request_type === 'ADD_TEACHER'){

        const userResult = await User.findByEmail(body.email);
        if (!userResult.success){
            return new Response(JSON.stringify({success: false, data: 'Не вдалося перевірити чи користувача було додано'}), {status: 500});
        }
       
        const requestResult = await Request.add(
          userResult.data.id,
          'ADD_TEACHER',
          'Реєстрація викладача',
          `Від користувача надійшло прохання про рєстрацію вчительского акаунту та надання необхідних прав`,
          'pending'
        );
    
        if (!requestResult.success) {
          return new Response(JSON.stringify({success: false, data: 'Не вдалося створити заявку на реєстрацію'}), {status: 500});
        }
      }
      else{
        return new Response(JSON.stringify({ success: false, data: "Невірний тип запиту" }), {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, data: 'Request added successfully' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error(error.message);
      return new Response(JSON.stringify({ success: false, data: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  

export async function PUT(req) {
    const body = await req.json();
  try {
        const result = await Request.updateAll(body.user_id, body.request_type, body.subject, body.description, body.status);
        if (!result.success){
            throw new Error('Couldn\'t update the request');
        }

        return new Response(JSON.stringify({success: true, data: 'Request updated successfully' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({success: false, data: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function PATCH(req) {
    const body = await req.json();

  try {
        if (body.request_type === 'ADD_INSTITUTION'){
            await handleAddInstitutionRequests(body);
            return new Response(JSON.stringify({ success: true, data: `Success. Request is ${body.status}.` }), {
              status: 201,
              headers: { 'Content-Type': 'application/json' },
            });
        }
        
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({success: false, data: error }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        });
    }
}

const handleAddInstitutionRequests = async (body) => {
  try {
      if (body.status === 'approved') {
        const pendingInstitutionResult = await Institution.findPendingByUserId(body.user_id);
  
        if (!pendingInstitutionResult || !pendingInstitutionResult.data) {
          throw new Error('Pending institution not found for the user');
        }
  
        const updatedInstitutionResult = await Institution.updateByUseed(
          pendingInstitutionResult.data.useed_code,
          pendingInstitutionResult.data.fullname,
          pendingInstitutionResult.data.institution_type,
          pendingInstitutionResult.data.shortname,
          pendingInstitutionResult.data.ownership_form,
          pendingInstitutionResult.data.coatsuu_code,
          pendingInstitutionResult.data.region,
          pendingInstitutionResult.data.settlement,
          pendingInstitutionResult.data.address,
          pendingInstitutionResult.data.governing_body_in_charge_of_education,
          pendingInstitutionResult.data.phone_number,
          pendingInstitutionResult.data.email,
          pendingInstitutionResult.data.website,
          pendingInstitutionResult.data.admin_user_fullname,
          pendingInstitutionResult.data.admin_user_id
        );

  
        if (!updatedInstitutionResult.success) {
          throw new Error('Could not update institution before deleting pending');
        }
  
        const deletePendingInstitutionResult = await Institution.deletePendingByUseed(pendingInstitutionResult.data.useed_code);

        if (!deletePendingInstitutionResult) {
          throw new Error('Could not delete pending institution');
        }
  
        const userId = pendingInstitutionResult.data.admin_user_id;

        const roleName = 'INSTITUTION_ADMIN';
        const assignUserRoleResult = await Role.assignRoleByUserId(userId, roleName, pendingInstitutionResult.data.useed_code);
  
        if (!assignUserRoleResult.success) {
          throw new Error('Could not assign role to a user');
        }
  
        const updateRequestResult = await Request.updateStatus(body.id, body.status);
  
        if (!updateRequestResult.success) {
          throw new Error('Could not update request');
        }
  
        return new Response(JSON.stringify({ success: true, data: `Success. Request is ${body.status}.` }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      else if(body.status === 'denied'){
        const pendingInstitutionResult = await Institution.findPendingByUserId(body.user_id);
  
        if (!pendingInstitutionResult || !pendingInstitutionResult.data) {
          return new Response(JSON.stringify({ success: false, data: 'Pending institution not found for the user' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }
  
        const deletePendingInstitutionResult = await Institution.deletePendingByUseed(pendingInstitutionResult.data.useed_code);

        if (!deletePendingInstitutionResult) {
          throw new Error('Could not delete pending institution');
        }
  
        const updateRequestResult = await Request.updateStatus(body.id, body.status);

        if (!updateRequestResult.success) {
          throw new Error('Could not update request');
        }
  
        return new Response(JSON.stringify({ success: true, data: `Success. Request is ${body.status}.` }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      else {
        return new Response(JSON.stringify({ success: false, data: 'Invalid status' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (error) {
      console.error(error.message);
      return new Response(JSON.stringify({ success: false, data: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  };
  

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    try {
        const requestResult = await Request.findById(id);
        if (!requestResult.success) {
            return new Response(JSON.stringify({ success: false, data: 'Request wasn\'t found' }), { status: 404 });
        }

        const pendingInstitutionResult = await Institution.findPendingByUserId(requestResult.data.user_id);
        if (!pendingInstitutionResult.success) {
            return new Response(JSON.stringify({ success: false, data: 'Pending institution wasn\'t found' }), { status: 404 });
        }

        const deletePendingInstitutionResult = await Institution.deletePendingByAdminUserId(requestResult.data.user_id);
        if (!deletePendingInstitutionResult.success) {
            return new Response(JSON.stringify({ success: false, data: 'Pending institution wasn\'t deleted' }), { status: 500 });
        }

        const result = await Request.deleteById(id);
        if (!result.success) {
            return new Response(JSON.stringify({ success: false, data: 'Request wasn\'t deleted' }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, data: result.data }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ success: false, data: 'Internal server error' }), { status: 500 });
    }
}
