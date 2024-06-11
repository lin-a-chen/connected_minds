import { getUser } from "@/lib/dal";
import TeacherCabinet from "@/components/main pages/cabinet/TeacherCabinet";
export default async function TeacherCabinetPage(){
    const user = await getUser();
    
    return(
        <TeacherCabinet user={user}/>
    );
    
}