import TeacherProfileView from "@/components/user/teacher/TeacherProfileView";
import { headers } from "next/headers";
import { getUser, getUserRole } from "@/lib/dal";

const getTeacher = async (teacherId) => {
	const base = "http://localhost:3000";

	const teacherResponse = await fetch(
		`${base}/api/institution/teachers?id=${teacherId}`
	);
	const teacherResult = await teacherResponse.json();
	if (!teacherResult.success) {
		console.error(teacherResult.data);
		return;
	}

	{console.log('teacherresult', teacherResult)}

	const userResponse = await fetch(
		`${base}/api/users?id=${teacherResult.data.user_id}`
	);
	const userResult = await userResponse.json();
	if (!userResult.success) {
		console.error(userResult.data);
		return;
	}

	return {teacher: teacherResult.data, teacherUser: userResult.data};
};

export default async function ViewTeacher() {
	const headersList = headers();
  	const pathname = headersList.get("x-current-path") || "";
	const teacherUserId = pathname.split("/").pop();

	const teacher = await getTeacher(teacherUserId);
	const user = await getUser();
	const role = await getUserRole();
	return (
		<>
			{teacher && (
				<TeacherProfileView
					currentUser={user}
					teacher={teacher.teacher}
					teacherUser={teacher.teacherUser}
					currentRole={role}
				/>
			)}
		</>
	);
}
