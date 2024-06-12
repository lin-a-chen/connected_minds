import TeacherProfileView from "@/components/user/teacher/TeacherProfileView";
import { headers } from "next/headers";

const getTeacher = async (userId) => {
	const base = "http://localhost:3000";

	const response = await fetch(
		`${base}/api/institution/teachers?user-id=${userId}`
	);
	const result = await response.json();
	if (!result.success) {
		console.error(result.data);
		return;
	}
	return result.data;
};

const getUser = async (userId) => {
	const base = "http://localhost:3000";

	const response = await fetch(`${base}/api/users?id=${userId}`);
	const result = await response.json();
	if (!result.success) {
		console.error(result.data);
		return;
	}
	return result.data;
};

export default async function ViewTeacher() {
	const headersList = headers();
	const pathname = headersList.get("x-current-path") || "";
	const userId = pathname.split("/").pop();

	const teacher = await getTeacher(userId);
	const user = await getUser(userId);

	return (
		<>
			{teacher && (
				<TeacherProfileView
					user={user}
					teacher={teacher}
				/>
			)}
		</>
	);
}
