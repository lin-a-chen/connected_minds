// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import styles from "./Chat.module.scss";
// import { TbChecks, TbSend2 } from "react-icons/tb";
// import Picker from "emoji-picker-react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:3001");

// const Chat = ({ talker, room, currentUser }) => {
// 	const [currentMsg, setCurrentMsg] = useState("");
// 	const [messages, setMessages] = useState([]);
// 	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
// 	const messagesEndRef = useRef(null); // Ref to the end of messages container

// 	useEffect(() => {
// 		const fetchMessages = async () => {
// 			const response = await fetch(
// 				`/api/user/chats/messages?room-id=${room.room_id}`
// 			);
// 			const result = await response.json();

// 			if (result.success) {
// 				setMessages(result.data);
// 			} else {
// 				console.error(result.data);
// 			}
// 		};

// 		fetchMessages();

// 		handleJoinRoom();

// 		socket.on("receive_msg", (data) => {
// 			setMessages((prevChat) => [...prevChat, data]);
// 		});

// 		return () => {
// 			socket.off("receive_msg");
// 		};
// 	}, [room.room_id]);

// 	useEffect(() => {
// 		scrollToBottom();
// 	}, [messages]);

// 	const handleJoinRoom = () => {
// 		socket.emit("join_room", room.room_id);
// 	};

// 	// useEffect(() => {
// 	//     handleJoinRoom();
// 	// }, [room.room_id]);

// 	const sendData = async (e) => {
// 		e.preventDefault();
// 		if (currentMsg !== "") {
// 			const msgData = {
// 				room_id: room.room_id,
// 				sender_id: currentUser.id,
// 				text: currentMsg,
// 				sending_datetime: new Date().toISOString(),
// 			};

// 			// Optimistically add the message to the UI
// 			setMessages((prevMessages) => [...prevMessages, msgData]);

// 			const response = await fetch("/api/user/chats/messages", {
// 				method: "POST",
// 				headers: {
// 					"Content-Type": "application/json",
// 				},
// 				body: JSON.stringify(msgData),
// 			});

// 			if (response.ok) {
// 				// Update UI after successful sending
// 				socket.emit("send_msg", msgData);
// 				setCurrentMsg("");
// 			} else {
// 				// Handle error if message sending fails
// 				console.error("Failed to send message");
// 				// Rollback the UI change
// 				setMessages((prevMessages) =>
// 					prevMessages.filter((msg) => msg !== msgData)
// 				);
// 			}
// 		}
// 	};

// 	const onEmojiClick = (emojiObject) => {
// 		setCurrentMsg(currentMsg + emojiObject.emoji);
// 	};

// 	const handleInputChange = (e) => {
// 		setCurrentMsg(e.target.value);
// 	};

// 	const scrollToBottom = () => {
// 		if (messagesEndRef.current) {
// 			messagesEndRef.current.scrollIntoView({
// 				behavior: "smooth",
// 				block: "end",
// 				inline: "nearest",
// 			});
// 		}
// 	};
	

// 	return (
// 		<div className={styles.page}>
// 			<div className={styles.container}>
// 				<div className={styles.header}>
// 					<div className={styles.profilePic}>
// 						<img
// 							src={
// 								talker.photo
// 									? talker.photo
// 									: "/images/school-child1.png"
// 							}
// 							alt="Profile"
// 						/>
// 					</div>
// 					<span>{`${talker.firstname} ${talker.lastname}`}</span>
// 				</div>
// 				<p className={styles.day}>Сьогодні</p>
// 				<div className={styles.user}>
// 					{messages.map(
// 						(
// 							{ room_id, sender_id, text, sending_datetime },
// 							key
// 						) => (
// 							<div
// 								key={key}
// 								className={`${
// 									sender_id === talker.id
// 										? styles.userRight
// 										: styles.userLeft
// 								} ${styles.userRow}`}>
// 								<div
// 									className={`${styles.profilePhotoCircle} ${
// 										sender_id === talker.id
// 											? styles.profilePhotoCircleRight
// 											: styles.profilePhotoCircleLeft
// 									}`}>
// 									<img
// 										src={
// 											sender_id === talker.id
// 												? talker.photo
// 												: currentUser.photo
// 										}
// 										alt="Profile"
// 									/>
// 								</div>
// 								<div className={styles.messageContainer}>
// 									<div
// 										className={`${styles.messageInfo} ${
// 											sender_id === talker.id
// 												? styles.messageInfoRight
// 												: styles.messageInfoLeft
// 										}`}>
// 										<div
// 											className={`${styles.messageText} ${
// 												sender_id === talker.id
// 													? styles.messageTextRight
// 													: styles.messageTextLeft
// 											}`}>
// 											{text}
// 										</div>
// 										<div
// 											className={`${
// 												styles.messageStatus
// 											} ${
// 												sender_id === talker.id
// 													? styles.messageStatusRight
// 													: styles.messageStatusLeft
// 											}`}>
// 											<TbChecks />
// 										</div>
// 									</div>
// 									<div
// 										className={`${styles.messageTime} ${
// 											sender_id === talker.id
// 												? styles.messageTimeRight
// 												: styles.messageTimeLeft
// 										}`}>
// 										<span>
// 											{new Date(
// 												sending_datetime
// 											).toLocaleTimeString([], {
// 												hour: "2-digit",
// 												minute: "2-digit",
// 											})}
// 										</span>
// 									</div>
// 								</div>
// 							</div>
// 						)
// 					)}
// 					<div ref={messagesEndRef} />{" "}
// 				</div>
// 				<div className={styles.inputContainer}>
// 					<form onSubmit={sendData}>
// 						<textarea
// 							className={styles.messageInput}
// 							value={currentMsg}
// 							placeholder="Введіть повідомлення..."
// 							onChange={handleInputChange}
// 							onKeyDown={(e) => {
// 								if (e.key === "Enter" && !e.shiftKey) {
// 									e.preventDefault();
// 									sendData(e);
// 								}
// 							}}
// 						/>
// 						<button
// 							type="button"
// 							className={styles.emojiButton}
// 							onClick={() =>
// 								setShowEmojiPicker(!showEmojiPicker)
// 							}>
// 							😊
// 						</button>
// 						{showEmojiPicker && (
// 							<div className={styles.emojiPicker}>
// 								<Picker onEmojiClick={onEmojiClick} />
// 							</div>
// 						)}
// 						<button
// 							type="submit"
// 							className={styles.buttonIcon}>
// 							<TbSend2 />
// 						</button>
// 					</form>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// export default Chat;

'use client';

import React, { useEffect, useState, useRef } from "react";
import styles from "./Chat.module.scss";
import { TbChecks, TbSend2 } from "react-icons/tb";
import Picker from "emoji-picker-react";
import { io } from "socket.io-client";
import Loading from "@/components/modals/Loading";

const socket = io("http://localhost:3001");

const Chat = ({ talker, room, currentUser }) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null); // Ref to the end of messages container

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(
        `/api/user/chats/messages?room-id=${room.room_id}`
      );
      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
      } else {
        console.error(result.data);
      }
    };

    fetchMessages();

    handleJoinRoom();

    socket.on("receive_msg", (data) => {
      setMessages((prevChat) => [...prevChat, data]);
    });

    return () => {
      socket.off("receive_msg");
    };
  }, [room.room_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinRoom = () => {
    socket.emit("join_room", room.room_id);
  };

  const sendData = async (e) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData = {
        room_id: room.room_id,
        sender_id: currentUser.id,
        text: currentMsg,
        sending_datetime: new Date().toISOString(),
      };

      // Optimistically add the message to the UI
      setMessages((prevMessages) => [...prevMessages, msgData]);

      const response = await fetch("/api/user/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(msgData),
      });

      if (response.ok) {
        // Update UI after successful sending
        socket.emit("send_msg", msgData);
        setCurrentMsg("");
      } else {
        // Handle error if message sending fails
        console.error("Failed to send message");
        // Rollback the UI change
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg !== msgData)
        );
      }
    }
  };

  const onEmojiClick = (emojiObject) => {
    setCurrentMsg(currentMsg + emojiObject.emoji);
  };

  const handleInputChange = (e) => {
    setCurrentMsg(e.target.value);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);

    if (
      today.getDate() === messageDate.getDate() &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    ) {
      return "Сьогодні";
    } else if (
      today.getDate() - messageDate.getDate() === 1 &&
      today.getMonth() === messageDate.getMonth() &&
      today.getFullYear() === messageDate.getFullYear()
    ) {
      return "Вчора";
    } else {
      const day = messageDate.getDate();
      const month = messageDate.getMonth() + 1;
      const year =
        today.getFullYear() === messageDate.getFullYear() ? "" : messageDate.getFullYear();
      return `${day < 10 ? "0" + day : day}.${
        month < 10 ? "0" + month : month
      }.${year}`;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.profilePic}>
            <img
              src={
                talker.photo ? talker.photo : "/images/school-child1.png"
              }
              alt="Profile"
            />
          </div>
          <span>{`${talker.firstname} ${talker.lastname}`}</span>
        </div>
        {/* <p className={styles.day}>Сьогодні</p> */}
        <div className={styles.user}>
          {messages && messages.map(
            ({ room_id, sender_id, text, sending_datetime }, key) => (
              <div
                key={key}
                className={`${sender_id === talker.id ? styles.userRight : styles.userLeft} ${styles.userRow}`}
              >
                <div
                  className={`${styles.profilePhotoCircle} ${
                    sender_id === talker.id ? styles.profilePhotoCircleRight : styles.profilePhotoCircleLeft                  }`}
					>
					  <img
						src={
						  sender_id === talker.id ? talker.photo : currentUser.photo
						}
						alt="Profile"
					  />
					</div>
					<div className={styles.messageContainer}>
					  <div
						className={`${styles.messageInfo} ${
						  sender_id === talker.id
							? styles.messageInfoRight
							: styles.messageInfoLeft
						}`}
					  >
						<div
						  className={`${styles.messageText} ${
							sender_id === talker.id
							  ? styles.messageTextRight
							  : styles.messageTextLeft
						  }`}
						>
						  {text}
						</div>
						<div
						  className={`${styles.messageStatus} ${
							sender_id === talker.id
							  ? styles.messageStatusRight
							  : styles.messageStatusLeft
						  }`}
						>
						  <TbChecks />
						</div>
					  </div>
					  <div
						className={`${styles.messageTime} ${
						  sender_id === talker.id
							? styles.messageTimeRight
							: styles.messageTimeLeft
						}`}
					  >
						<span>
						  {formatDate(sending_datetime)}{" "}
						  {new Date(sending_datetime).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						  })}
						</span>
					  </div>
					</div>
				  </div>
				)
			  )}
        {(!messages || messages.length <=0) && <Loading/>}
			  <div ref={messagesEndRef} />{" "}
			</div>
			<div className={styles.inputContainer}>
			  <form onSubmit={sendData}>
				<textarea
				  className={styles.messageInput}
				  value={currentMsg}
				  placeholder="Введіть повідомлення..."
				  onChange={handleInputChange}
				  onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
					  e.preventDefault();
					  sendData(e);
					}
				  }}
				/>
				<button
				  type="button"
				  className={styles.emojiButton}
				  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
				>
				  😊
				</button>
				{showEmojiPicker && (
				  <div className={styles.emojiPicker}>
					<Picker onEmojiClick={onEmojiClick} />
				  </div>
				)}
				<button type="submit" className={styles.buttonIcon}>
				  <TbSend2 />
				</button>
			  </form>
			</div>
		  </div>
		</div>
	  );
	};
	
	export default Chat;
	
