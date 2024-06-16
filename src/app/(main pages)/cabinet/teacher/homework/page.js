import TeacherHomeworks from "@/components/main pages/homeworks/TeacherHomeworks";
import { getUser, getUserRole } from "@/lib/dal";

export default async function TeacherHomeworksPage() {

    const user = await getUser();
    const userRole = await getUserRole();
	return(
        <>
        {user && <TeacherHomeworks user={user} userRole={userRole}/>}
        </>
        
    )
}
