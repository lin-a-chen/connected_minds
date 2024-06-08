import Classes from "@/components/main pages/classes/Classes";
import { getUserRole } from "@/lib/dal";

export default async function TeachersClasses() {
    const role = await getUserRole();
    console.log('role', role);
    return(
        <>
            {role && <Classes userRole={role}/>}
        </>
        
    )
}