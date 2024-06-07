import { getInstitutionUseedCode } from "@/lib/dal";
import Institution from "@/models/Institution";
export const GET = async (req, res) => {
  try {
    const useedCode = await getInstitutionUseedCode();
    const institution = await Institution.findByUseed(useedCode);
    return new Response(JSON.stringify({success: true, data: institution.data}), {status: 200});
  } catch (error) {
    console.error("Error fetching useed code:", error);
    return new Response(JSON.stringify({success: false, data: error}), {status: 500});
  }
}
