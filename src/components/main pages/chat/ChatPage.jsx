// "use client";
// import styles from "./ChatPage.module.scss";
// import { io } from "socket.io-client";
// import { useState, useEffect } from "react";
// import Chat from "@/components/main pages/chat/Chat";
// import SearchUsers from "@/components/UI/SearchUsers";
// import Loading from "@/components/modals/Loading";
// import moment from "moment";

// export default function ChatPage({currentUser}) {
//   const [showChat, setShowChat] = useState(false);
//   const [userName, setUserName] = useState("");
//   const [showSpinner, setShowSpinner] = useState(false);
//   const [roomId, setroomId] = useState("");
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);

//   var socket = io("http://localhost:3001");

//   const handleJoin = () => {
//     if (userName !== "" && roomId !== "") {
//       console.log(userName, "userName", roomId, "roomId");
//       socket.emit("join_room", roomId);
//       setShowSpinner(true);
// // You can remove this setTimeout and add your own logic
//       setTimeout(() => {
//         setShowChat(true);
//         setShowSpinner(false);
//       }, 4000);
//     } else {
//       alert("Please fill in Username and Room Id");
//     }
//   };

//   const fetchСhatrooms = async () => {

//   };

//   useEffect(() => {

//     const fetchUsers = async () => {
//       try {
//         const schoolchildrenResponse = await fetch(`/api/institution/schoolchildren`, { method: "GET" });
//         const schoolchildrenResult = await schoolchildrenResponse.json();

//         if (!schoolchildrenResult.success) {
//           console.error(schoolchildrenResult.data);
//           return;
//         }

//         const formattedSchoolchildren = schoolchildrenResult.data.map(el => {
//             const obj = {id: el.user_id, firstname: el.firstname, lastname: el.lastname, antroponym: el.antroponym,
//                   email: el.email, role: '', photo: el.photo};
//             return obj;
//         });

//         const teachersResponse = await fetch(`/api/institution/teachers`, { method: "GET" });
//         const teachersResult = await teachersResponse.json();

//         if (!teachersResult.success) {
//           console.error(teachersResult.data);
//           return;
//         }

//         const formattedTeachers = teachersResult.data.map(el => {
//           const obj = {id: el.user_id, firstname: el.firstname, lastname: el.lastname, antroponym: el.antroponym,
//                 email: el.email, role: '(Вчитель/ка)', photo: el.photo};
//           return obj;
//       });
//             const usersFormatted = [...formattedSchoolchildren, ...formattedTeachers];
//             console.log('usersFormatted', teachersResult.data)

//             setUsers(usersFormatted);

//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleSearchChange = (result) => {
//     if (window){
//       if (currentUser.id !== result.id){

//         if (result.role === '(Вчитель/ка)'){
//           window.location.href = `/user/teacher/${result.id}`;
//         }
//         else{
//           window.location.href = `/user/student/${result.id}`;
//         }

//       }
//       else{
//         if (result.role === '(Вчитель/ка)'){
//           window.location.href = `/cabinet/teacher`;
//         }
//         else{
//           window.location.href = `/cabinet/student`;
//         }

//       }

//     }
//     // if (result) {
//     //   setCurrentRequests([result]);
//     // } else {
//     //   handleCurrentItemsChange(requests.slice(0, 10));
//     // }
//   };

//   return (
//     <>
//     {users && <div className={styles.page}>
//       <div className={styles.header}>
//         <SearchUsers
//                 className={styles.autocompleteInput}
//                 dataToSearch={users}
//                 searchFields={['firstname', 'lastname', 'antroponym', 'class_name', 'role', 'photo']}
//                 onChange={handleSearchChange}
//                 placeholder="Шукати..."
//                 excludedFields={['id', 'phone_number', 'email', 'photo']}
//             />
//       </div>
//     </div>}
//     {!users && <Loading/>}
//     </>

//     // <div>
//     //   <div
//     //     className={styles.main_div}
//     //     style={{ display: showChat ? "none" : "" }}
//     //   >
//     //     <input
//     //       className={styles.main_input}
//     //       type="text"
//     //       placeholder="Username"
//     //       onChange={(e) => setUserName(e.target.value)}
//     //       disabled={showSpinner}
//     //     />
//     //     <input
//     //       className={styles.main_input}
//     //       type="text"
//     //       placeholder="room id"
//     //       onChange={(e) => setroomId(e.target.value)}
//     //       disabled={showSpinner}
//     //     />
//     //     <button className={styles.main_button} onClick={() => handleJoin()}>
//     //       {!showSpinner ? (
//     //         "Join"
//     //       ) : (
//     //         <div className={styles.loading_spinner}></div>
//     //       )}
//     //     </button>
//     //   </div>
//     //   <div style={{ display: !showChat ? "none" : "" }}>
//     //     <ChatPage socket={socket} roomId={roomId} username={userName} />
//     //   </div>
//     // </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import styles from "./ChatPage.module.scss";
import SearchUsers from "@/components/UI/SearchUsers";
import Loading from "@/components/modals/Loading";
import NothingToShow from "@/components/modals/NothingToShow";

export default function ChatPage({ currentUser }) {
	const [chatRooms, setChatRooms] = useState([]);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchChatRooms = async () => {
			try {
				const response = await fetch(
					`/api/user/chats?user-id=${currentUser.id}`
				);
				const result = await response.json();
        if (!result.success){
          console.error(result.data);
          return;
        }
				setChatRooms([result.data]);
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

  useEffect(() => {
    if (window && selectedRoom){
      ('selectedRoom.room', selectedRoom.room)
      window.location.href = `/chats/${selectedRoom.room.room_id}`
    }
  }, [selectedRoom])

	const handleSearchChange = (result) => {
		if (window) {
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
					{chatRooms && chatRooms.length > 0 && <>
          <div className={styles.chats}>
			
						{/* <h2>Ваші чати:</h2> */}
							{chatRooms.map((roomObj) => (
								<div
									key={roomObj.user.id}
									onClick={() => window.location.href = roomObj.room.room_id ? `/chats/${roomObj.room.room_id}` : '/chats'}
                  >
                    <div className={styles.userPhoto}>
                      <img src={roomObj.user.photo ? roomObj.user.photo : `/images/school-child1.png`}/>
                    </div>{console.log('room', roomObj)}
										<div className={styles.roomName}>
											{roomObj.room.name ? roomObj.room.name : `${roomObj.user.firstname} ${roomObj.user.lastname}`}
										</div>
								</div>
							))}
					</div>
					
          </>}
          {(!chatRooms || chatRooms.length <= 0) && <NothingToShow imageSource={`images/nothing.png`} message={'У вас поки немає чатів. Скористайтесь пошуком та зв\'яжіться з користувачем'}/>}

				</div>
			) : (
				<Loading />
			)}
		</>
	);
}
