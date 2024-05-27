import Institution from "@/models/Institution";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const useed = searchParams.get("useed");
  console.log(useed);
  if (useed){
    try{
      const result = await Institution.findByUseed(useed);
  
      if (result.success){
        return new Response(JSON.stringify({success: true, data: result.data}), {status: 200});
      }
      else{
        return new Response(JSON.stringify({success: false, data: 'No settlements found'}), {status: 500});
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
        return new Response(JSON.stringify({success: false, data: 'No regions found'}), {status: 500});
      }
    }
    catch(error){
      return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500});
    }
  }
}