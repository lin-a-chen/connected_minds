import User from "@/models/User";
import ChatRoom from "@/models/ChatRoom";

export const GET = async(req) => {

    const {searchParams} = new URL(req.url);
    const userId = searchParams.get('user-id');
    const roomId = searchParams.get('room-id');

    try{
        if (userId && !roomId){

            const findRoomResult = await ChatRoom.findByUserId(userId);

            if (!findRoomResult.success){
                return new Response(JSON.stringify({success: false, data: 'Couldn\'t check if chat rooms exist for this user'}), {status: 500})
            }

            const findRoomUsersResult = await ChatRoom.findSecondRoomUser(findRoomResult.data.room_id, userId);

            if (!findRoomUsersResult.success){
                return new Response(JSON.stringify({success: false, data: 'Couldn\'t find users for this room'}), {status: 500})
            }

            return new Response(JSON.stringify({success: true, data: {room: findRoomResult.data, user: findRoomUsersResult.data}}), {status: 200})

        }
        else if(roomId && userId){
            const findRoomResult = await ChatRoom.findByRoomId(roomId);

            if (!findRoomResult.success){
                return new Response(JSON.stringify({success: false, data: 'Couldn\'t check if chat rooms exist for this user'}), {status: 500})
            }

            const findRoomUsersResult = await ChatRoom.findSecondRoomUser(roomId, userId);

            if (!findRoomUsersResult.success){
                return new Response(JSON.stringify({success: false, data: 'Couldn\'t find users for this room'}), {status: 500})
            }

            return new Response(JSON.stringify({success: true, data: {room: findRoomResult.data, user: findRoomUsersResult.data}}), {status: 200})
        }

        return new Response(JSON.stringify({success: false, data: 'User id wasn\'t provided'}), {status: 400})

    }
    catch(error){
        console.error(error);
        return new Response(JSON.stringify({success: false, data: 'Internal server error'}), {status: 500})
    }
    if (userId){

    }

}