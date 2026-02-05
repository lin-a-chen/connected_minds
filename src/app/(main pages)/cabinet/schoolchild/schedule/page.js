import { getUser, getUserRole } from "@/lib/dal";
import SchoolchildSchedulePageComponent from "@/components/main pages/schedule/SchoolchildSchedulePageComponent";

export default async function SchoolchildSchedule(){
    
    const user = await getUser();
    const role = await getUserRole();
    return(
        <>
            {role && <SchoolchildSchedulePageComponent userRole={role} user={user}/>}
        </>
    );
}