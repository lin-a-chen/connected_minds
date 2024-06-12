import { getUser } from "@/lib/dal";
import ChatPage from "@/components/main pages/chat/ChatPage";

export default async function ChatsPage() {
	const user = await getUser();

	return <>{user && <ChatPage currentUser={user} />}</>;
}
