"use client";
import { useEffect, useState } from "react";
import styles from "./TeacherProfile.module.scss";
import { TbSchool, TbPhone, TbMail } from "react-icons/tb";

export default function TeacherProfileView({ user, teacher }) {
	// const [teacher, setTeacher] = useState(null);

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div className={styles.profilePicture}>
					<img src={user.photo} />
				</div>
				<div className={styles.profileDetails}>
					<h4>{`${teacher.firstname} ${teacher.antroponym} ${teacher.lastname}`}</h4>

					<div className={styles.details}>
						<div>
							<TbSchool />
							{teacher.position}
						</div>
						<div>
							<a href={`/chats?id=jhuiui`}>
								<TbMail />
								Написати
							</a>
						</div>
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
					<span>{user.phone_number}</span>
					<span>{user.email}</span>
				</div>
			</div>
		</div>
	);
}
