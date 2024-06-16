const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Replace with your frontend URL
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.info("A user connected:", socket.id);

    socket.on("join_room", (roomId) => {
        socket.join(roomId);
        console.info(`user with id-${socket.id} joined room - ${roomId}`);
    });

	socket.on("send_msg", (data) => {
		socket.to(data.room_id).emit("receive_msg", data);
	});

    socket.on("disconnect", () => {
        console.info("A user disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.info(`Socket.io server is running on port ${PORT}`);
});
