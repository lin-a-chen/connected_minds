import Institution from "@/models/Institution";
import Request from "@/models/Request";

export async function GET() {
    try{
        const result = await Institution.findAllPending();
        console.log(result);

        if (result.success){
            return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
        }
        else{
            return new Response(JSON.stringify({success: false, data: 'No pending institutions found'}), {status: 404});
        }
    }
    catch(error){
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
}

export const PUT = async (req) => {
    const body = await req.json();
  
    try {
        const updateInstitution = await Institution.updatePendingByUseed(body.useed_code,
            body.fullname,
            body.institution_type,
            body.shortname,
            body.ownership_form,
            body.coatsuu_code,
            body.region,
            body.settlement,
            body.address,
            body.governing_body_in_charge_of_education,
            body.phone_number,
            body.email,
            body.website,
            body.admin_user_fullname,
            body.admin_user_id,
        );
        if (!updateInstitution.success){
          throw new Error('Something went wrong. Pending institution hasn\'t been updated');
        }

        return new Response(JSON.stringify({success: true, data: `Pending institution had been successfully updated` }), {
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

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const useedCode = searchParams.get("useed_code");

  try{
      const pendingInstitutionResult = await Institution.findPendingByUseedCode(useedCode);

      if (!pendingInstitutionResult.success){
        return new Response(JSON.stringify({success: false, data: 'Pending institution not found'}), {status: 404});
      }

      const pendingInstitutionAdminUserId = pendingInstitutionResult.data.admin_user_id;

      const deleteRequestResult = await Request.deleteByUserId(pendingInstitutionAdminUserId);

      if (!deleteRequestResult.success){
        throw new Error('Couldn\'t delete request');
      }
      
      const result = await Institution.deletePendingByUseed(useedCode);

      if (!result.success){
        throw new Error('Error deleting pending institution');
      }

      return new Response(JSON.stringify({success: true, data: result.data}), {status: 201});
  }
  catch(error){
    console.error(error);
    return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
  }
}
  

