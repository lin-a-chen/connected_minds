import { headers } from "next/headers";
import { getUser, getUserRole } from "@/lib/dal";
import SchoolchildProfileView from "@/components/user/teacher/SchoolchildProfileView";

const getSchoolchild = async (schoolchildId) => {
	const base = "http://localhost:3000";

	const schoolchildResponse = await fetch(
		`${base}/api/institution/schoolchildren?id=${schoolchildId}`
	);
	const schoolchildResult = await schoolchildResponse.json();
	if (!schoolchildResult.success) {
		console.error(schoolchildResult.data);
		return;
	}
	const userResponse = await fetch(
		`${base}/api/users?id=${schoolchildResult.data.user_id}`
	);
	const userResult = await userResponse.json();
	if (!userResult.success) {
		console.error(userResult.data);
		return;
	}
	return {schoolchild: schoolchildResult.data, schoolchildUser: userResult.data};
};

export default async function ViewSchoolchild() {
	const headersList = headers();
	const pathname = headersList.get("x-current-path") || "";
	const schoolchildUserId = pathname.split("/").pop();

	const schoolchild = await getSchoolchild(schoolchildUserId);
	const user = await getUser();
	const role = await getUserRole();

	return (
		<>
			{schoolchild && (
				<SchoolchildProfileView
					currentUser={user}
					schoolchild={schoolchild.schoolchild}
					schoolchildUser={schoolchild.schoolchildUser}
					currentRole={role}
				/>
			)}
		</>
	);
}
