import { getUser, getUserRole } from "@/lib/dal";
import TeacherSchedulePageComponent from "@/components/main pages/schedule/TeacherSchedule";

export default async function TeacherSchedule(){
    
    const user = await getUser();
    const role = await getUserRole();
    return(
        <>
            {role && <TeacherSchedulePageComponent userRole={role} user={user}/>}
        </>
    );
}