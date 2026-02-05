import { getUserRole } from "@/lib/dal";
import SchedulePageComponent from "@/components/main pages/schedule/SchedulePageComponent";

export default async function InstitutionAdminSchedule(){
    
    const role = await getUserRole();
    return(
        <>
            {role && <SchedulePageComponent userRole={role}/>}
        </>
    );
}