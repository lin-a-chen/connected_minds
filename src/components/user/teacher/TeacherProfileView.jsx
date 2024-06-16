"use client";
import { useEffect, useState } from "react";
import styles from "./TeacherProfile.module.scss";
import { TbSchool, TbPhone, TbMail } from "react-icons/tb";

export default function TeacherProfileView({
	teacherUser,
	teacher,
	currentUser,
}) {
	const fetchChatRooms = async () => {
		const response = await fetch(
			`/api/user/chats?user-id=${teacherUser.id}`
		);
		const result = await response.json();
		if (!result.success) {
			console.error(result.data);
			return null;
		}
		return result.data;
	};

	const handleWriteLetter = async () => {
		const rooms = await fetchChatRooms();

		if (rooms) {
			const room = rooms.filter(
				(roomObj) => roomObj.user.id === currentUser.id
			)[0];

			if (!room) {
				const response = await fetch(`/api/user/chats`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: null,
						type: "PERSONAL",
						currentUserId: currentUser.id,
						targetUserId: teacherUser.id,
					}),
				});
				const result = await response.json();
				if (!result.success) {
					console.error(result.data);
					return null;
				}

				if (window) {
					window.location.href = `/chats/${result.data}`;
				}
			} else {
				if (window) {
					window.location.href = `/chats/${room.room.room_id}`;
				}
			}
		} else return;
	};

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div className={styles.profilePicture}>
					<img src={teacherUser.photo ? teacherUser.photo : '/images/teacher.png'} />
				</div>
				<div className={styles.profileDetails}>
					<h4>{`${teacher.firstname} ${teacher.antroponym} ${teacher.lastname}`}</h4>

					<div className={styles.details}>
						<div>
							<TbSchool />
							{teacher.position}
						</div>
						<button onClick={handleWriteLetter}>
							<TbMail />
							Написати
						</button>
					</div>
				</div>
			</div>
			<h4>Контакти</h4>
			<div className={styles.contacts}>
				<div>
					<div>
						<TbPhone /> <label>Телефон:</label>
					</div>
					<div>
						<TbMail /> <label>Пошта:</label>
					</div>
				</div>

				<div>
					<span>{teacherUser.phone_number}</span>
					<span>{teacherUser.email}</span>
				</div>
			</div>
		</div>
	);
}
