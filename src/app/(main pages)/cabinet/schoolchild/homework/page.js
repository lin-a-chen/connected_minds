import SchoolchildHomeworks from "@/components/main pages/homeworks/SchoolchildHomeworks";
import { getUser, getUserRole } from "@/lib/dal";

export default async function TeacherHomeworksPage() {

    const user = await getUser();
    const userRole = await getUserRole();
	return(
        <>
        {user && <SchoolchildHomeworks user={user} userRole={userRole}/>}
        </>
        
    )
}
