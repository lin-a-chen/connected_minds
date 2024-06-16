import { getUser, getUserRole } from "@/lib/dal";
import AcademicRecordsSchoolchild from "@/components/main pages/academic records/AcademicRecordsSchoolchild";

export default async function TeacherAcademicRecords(){
    const role = await getUserRole();
    const user = await getUser();
    return(
        <>
            {role && <AcademicRecordsSchoolchild userRole={role} user={user}/>}
        </>
    );
}