import Classes from "@/components/main pages/classes/Classes";
import { getUser, getUserRole } from "@/lib/dal";

export default async function TeachersClasses() {
    const user = await getUser();
    const role = await getUserRole();
    console.log('role', role);
    return(
        <>
            {role && <Classes userRole={role} user={user}/>}
        </>
        
    )
}