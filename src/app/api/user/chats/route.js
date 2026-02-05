import ChatRoom from "@/models/ChatRoom";

export const GET = async (req) => {
	const { searchParams } = new URL(req.url);
	const userId = searchParams.get("user-id");
	const roomId = searchParams.get("room-id");

	try {
		if (userId && !roomId) {
			const findRoomResult = await ChatRoom.findByUserId(userId);

			if (!findRoomResult.success) {
				return new Response(
					JSON.stringify({
						success: false,
						data: "Couldn't check if chat rooms exist for this user",
					}),
					{ status: 500 }
				);
			}

			const rooms = [];
			if (findRoomResult.data) {
				for (const room of findRoomResult.data) {
					const findRoomUsersResult =
						await ChatRoom.findSecondRoomUser(
							room.room_id,
							userId,
						);

					if (!findRoomUsersResult.success) {
						return new Response(
							JSON.stringify({
								success: false,
								data: "Couldn't find users for this room",
							}),
							{ status: 500 }
						);
					}
					rooms.push({ room: room, user: findRoomUsersResult.data });
				}

                return new Response(
                    JSON.stringify({ success: true, data: [...rooms] }),
                    { status: 200 }
                );

				
			}
            else{
                return new Response(
					JSON.stringify({ success: true, data: [] }),
					{ status: 200 }
				);
            }
		} else if (roomId && userId) {

			const findRoomResult = await ChatRoom.findByRoomId(roomId);

			if (!findRoomResult.success) {
				return new Response(
					JSON.stringify({
						success: false,
						data: "Couldn't check if chat rooms exist for this user",
					}),
					{ status: 500 }
				);
			}

			const findRoomUsersResult = await ChatRoom.findSecondRoomUser(
				roomId,
				userId
			);

			if (!findRoomUsersResult.success) {
				return new Response(
					JSON.stringify({
						success: false,
						data: "Couldn't find users for this room",
					}),
					{ status: 500 }
				);
			}

			return new Response(
				JSON.stringify({
					success: true,
					data: {
						room: findRoomResult.data,
						user: findRoomUsersResult.data,
					},
				}),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({ success: false, data: "User id wasn't provided" }),
			{ status: 400 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};

export const POST = async (req) => {
	const body = await req.json();

	try {
		const addRoomResult = await ChatRoom.add(body.name, body.type);

		if (!addRoomResult.success || !addRoomResult.data) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't add chat room",
				}),
				{ status: 500 }
			);
		}
		const roomId = addRoomResult.data.id;

		const result = await ChatRoom.joinUsers(
			[body.currentUserId, body.targetUserId],
			roomId
		);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't add users to this room",
				}),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify({ success: true, data: roomId }), {
			status: 201,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};
