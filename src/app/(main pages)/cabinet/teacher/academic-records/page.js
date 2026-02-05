import { getUser, getUserRole } from "@/lib/dal";
import AcademicRecords from "@/components/main pages/academic records/AcademicRecords";

export default async function TeacherAcademicRecords(){
    const role = await getUserRole();
    const user = await getUser();
    return(
        <>
            {role && <AcademicRecords userRole={role} user={user}/>}
        </>
    );
}