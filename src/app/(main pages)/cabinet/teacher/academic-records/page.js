import { getUserRole } from "@/lib/dal";
import AcademicRecords from "@/components/main pages/academic records/AcademicRecords";

export default async function TeacherAcademicRecords(){
    const role = await getUserRole();
    return(
        <>
            {role && <AcademicRecords userRole={role}/>}
        </>
    );
}