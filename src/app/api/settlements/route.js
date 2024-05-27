import Settlement from "@/models/Settlement";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const region = searchParams.get("region");
  if (region){
    try{
      const result = await Settlement.findSettlementsByRegion(region);
  
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
      const result = await Settlement.findAllRegions();
      console.log(result);

  
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