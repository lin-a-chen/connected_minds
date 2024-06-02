import Institution from "@/models/Institution";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const useed = searchParams.get("useed");
  if (useed){
    try{
      const result = await Institution.findByUseed(useed);
  
      if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'No institutions found'}), {status: 500});
      }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
  }
  else{
    try{
      const result = await Institution.findAll();
  
      if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'No institutions found'}), {status: 500});
      }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
  }
}

export const PUT = async (req) => {
  const body = await req.json();

  try {
      const updateInstitution = await Institution.updateByUseed(body.useed_code,
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
      if (updateInstitution.success){
        return new Response(JSON.stringify({success: true, data: `Institution had been successfully updated` }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
      });
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'Something went wrong. Institution hasn\'t been updated' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

                
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({success: false, data: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const DELETE = async (req) => {
  const { searchParams } = new URL(req.url);
  const useedCode = searchParams.get("useed_code");
  try {
      const deleteInstitution = await Institution.deleteByUseed(useedCode);
      if (deleteInstitution.success){
        return new Response(JSON.stringify({success: true, data: 'Institution has been successfully deleted.' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      else{
        return new Response(JSON.stringify({success: false, data: "Something went wrong. Could not delete the institution." }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({success: false, data: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}