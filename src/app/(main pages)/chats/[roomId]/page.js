import Chat from "@/components/main pages/chat/Chat";
import { headers } from "next/headers";
import { getUser, getUserRole } from "@/lib/dal";
import Loading from "@/components/modals/Loading";

const getRoomObj = async (roomId, userId) => {
  const base = "http://localhost:3000";

  const response = await fetch(`${base}/api/user/chats?room-id=${roomId}&user-id=${userId}`);
  const result = await response.json();

  if (!result.success) {
    console.error("result.data", result.data);
    return null;
  }
  return result.data;
};

export default async function ViewTeacher() {
  const headersList = headers();
  const pathname = headersList.get("x-current-path") || "";
  const roomId = pathname.split("/").pop();
  const user = await getUser();

  if (user){
	const roomObj = await getRoomObj(roomId, user.id);
  
  return (
    <>
      {user && roomObj ? (
        <Chat
          talker={roomObj.user}
          room={roomObj.room}
          currentUser={user}
        />
      ) : 
        (!user && !roomObj) && <Loading />}
      
    </>
  );
  }
  
}
