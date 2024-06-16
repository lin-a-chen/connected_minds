import { getUser, getUserRole } from "@/lib/dal";
import SchoolchildCabinet from "@/components/main pages/cabinet/SchoolchildCabinet";
export default async function SchoolchildCabinetPage(){
    const user = await getUser();
    
    return(
        <SchoolchildCabinet user={user}/>
    );
    
}