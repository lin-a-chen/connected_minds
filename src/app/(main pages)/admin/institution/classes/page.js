import { getUserRole} from "@/lib/dal";
import Classes from "@/components/main pages/classes/Classes";

export default async function InstitutionAdminClasses(){

	const role = await getUserRole();
	return(
		<>
			{role && <Classes userRole={role}/>}
		</>
	)
}