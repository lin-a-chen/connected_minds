import Message from "@/models/Message";

export const GET = async (req) => {
	const { searchParams } = new URL(req.url);
	const roomId = searchParams.get("room-id");

	try {
		if (roomId) {
			const result = await Message.findByRoomId(roomId);

			if (!result.success) {
				return new Response(
					JSON.stringify({
						success: false,
						data: "Couldn't find messages for this room",
					}),
					{ status: 500 }
				);
			}

			return new Response(
				JSON.stringify({ success: true, data: result.data }),
				{ status: 200 }
			);
		}

		return new Response(
			JSON.stringify({ success: false, data: "Room id wasn't provided" }),
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
		const result = await Message.add(body.room_id, body.sender_id, body.text, body.is_read);

		if (!result.success) {
			return new Response(
				JSON.stringify({
					success: false,
					data: "Couldn't add message",
				}),
				{ status: 500 }
			);
		}

		return new Response(
			JSON.stringify({ success: true, data: result.data }),
			{ status: 201 }
		);
	} catch (error) {
		console.error(error);
		return new Response(
			JSON.stringify({ success: false, data: "Internal server error" }),
			{ status: 500 }
		);
	}
};
