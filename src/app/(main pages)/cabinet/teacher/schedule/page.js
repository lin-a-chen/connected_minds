import { getUserRole } from "@/lib/dal";
import SchedulePageComponent from "@/components/main pages/schedule/SchedulePageComponent";

export default async function TeacherSchedule(){
    
    const role = await getUserRole();
    return(
        <>
            {role && <SchedulePageComponent userRole={role}/>}
        </>
    );
}