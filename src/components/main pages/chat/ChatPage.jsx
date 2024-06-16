"use client";

import { useState, useEffect } from "react";
import styles from "./ChatPage.module.scss";
import SearchUsers from "@/components/UI/SearchUsers";
import Loading from "@/components/modals/Loading";
import NothingToShow from "@/components/modals/NothingToShow";

export default function ChatPage({ currentUser }) {
	const [chatRooms, setChatRooms] = useState([]);
	// const [selectedRoom, setSelectedRoom] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchChatRooms = async () => {
			try {
				const response = await fetch(
					`/api/user/chats?user-id=${currentUser.id}`
				);
				const result = await response.json();
				if (!result.success) {
					console.error(result.data);
					return;
				}
				setChatRooms(result.data);
			} catch (error) {
				console.error("Error fetching chat rooms:", error);
			}
		};

		fetchChatRooms();
	}, [currentUser]);

	const fetchUsers = async () => {
		try {
			const schoolchildrenResponse = await fetch(
				`/api/institution/schoolchildren`,
				{ method: "GET" }
			);
			const schoolchildrenResult = await schoolchildrenResponse.json();

			if (!schoolchildrenResult.success) {
				console.error(schoolchildrenResult.data);
				return;
			}

			const formattedSchoolchildren = schoolchildrenResult.data.map(
				(el) => {
					const obj = {
						id: el.user_id,
						firstname: el.firstname,
						lastname: el.lastname,
						antroponym: el.antroponym,
						email: el.email,
						role: "",
						photo: el.photo,
					};
					return obj;
				}
			);

			const teachersResponse = await fetch(`/api/institution/teachers`, {
				method: "GET",
			});
			const teachersResult = await teachersResponse.json();

			if (!teachersResult.success) {
				console.error(teachersResult.data);
				return;
			}

			const formattedTeachers = teachersResult.data.map((el) => {
				const obj = {
					id: el.user_id,
					firstname: el.firstname,
					lastname: el.lastname,
					antroponym: el.antroponym,
					email: el.email,
					role: "(Вчитель/ка)",
					photo: el.photo,
				};
				return obj;
			});
			const usersFormatted = [
				...formattedSchoolchildren,
				...formattedTeachers,
			];

			setUsers(usersFormatted);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	// useEffect(() => {
	// 	if (window && selectedRoom) {
	// 		"selectedRoom.room", selectedRoom.room;
	// 		window.location.href = `/chats/${selectedRoom.room.room_id}`;
	// 	}
	// }, [selectedRoom]);

	const handleSearchChange = (result) => {
		if (window && result) {
			if (currentUser.id !== result.id) {
				if (result.role === "(Вчитель/ка)") {
					window.location.href = `/user/teacher/${result.id}`;
				} else {
					window.location.href = `/user/student/${result.id}`;
				}
			} else {
				if (result.role === "(Вчитель/ка)") {
					window.location.href = `/cabinet/teacher`;
				} else {
					window.location.href = `/cabinet/student`;
				}
			}
		}
	};

	return (
		<>
			{users.length > 0 ? (
				<div className={styles.page}>
					<div className={styles.header}>
						<SearchUsers
							className={styles.autocompleteInput}
							dataToSearch={users}
							searchFields={[
								"firstname",
								"lastname",
								"antroponym",
								"class_name",
								"role",
								"photo",
							]}
							onChange={handleSearchChange}
							placeholder="Шукати користувачів..."
							excludedFields={[
								"id",
								"phone_number",
								"email",
								"photo",
							]}
						/>
					</div>
					{chatRooms && chatRooms.length > 0 && (
						<>
							<div className={styles.chats}>
								{chatRooms.map((roomObj) => (
									<div
										key={roomObj.user.id}
										onClick={() =>
											(window.location.href = roomObj.room
												.room_id
												? `/chats/${roomObj.room.room_id}`
												: "/chats")
										}>
										<div className={styles.userPhoto}>
											<img
												src={
													roomObj.user.photo
														? roomObj.user.photo
														: `/images/school-child1.png`
												}
											/>
										</div>
										<div className={styles.roomName}>
											{roomObj.room.name
												? roomObj.room.name
												: `${roomObj.user.firstname} ${roomObj.user.lastname}`}
										</div>
									</div>
								))}
							</div>
						</>
					)}
					{(!chatRooms || chatRooms.length <= 0) && (
						<NothingToShow
							imageSource={`images/nothing.png`}
							message={
								"У вас поки немає чатів. Скористайтесь пошуком та зв'яжіться з користувачем"
							}
						/>
					)}
				</div>
			) : (
				<Loading />
			)}
		</>
	);
}
