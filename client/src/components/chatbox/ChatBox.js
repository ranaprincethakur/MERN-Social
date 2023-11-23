import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import "./ChatBox.css";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUserId, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  //fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUserId);
    const getUserData = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setUserData(response?.data?.user);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUserId]);

  //fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/message/${chat?._id}`);
        setMessages(response?.data?.result);
      } catch (error) {
        console.log(error);
      }
    };
    if (chat !== null) fetchMessages();
  }, [chat]);

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };
    //send message to database
    try {
      const response = await axios.post(`/api/message/`, message);
      setMessages([...messages, response?.data?.result]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }

    //send message to socket server
    const receiverId = chat?.members?.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });
  };

  //always scroll to the last message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  return (
    <div className="ChatBox-container">
      {chat ? (
        <>
          {/* chat-header */}
          <div className="chat-header">
            <div className="follower">
              <div>
                <img
                  src={
                    userData?.profilePicture
                      ? process.env.REACT_APP_PUBLIC_FOLDER +
                        userData.profilePicture
                      : process.env.REACT_APP_PUBLIC_FOLDER +
                        "defaultProfile.png"
                  }
                  alt="Profile"
                  className="followerImage"
                  style={{ width: "50px", height: "50px" }}
                />
                <div className="name" style={{ fontSize: "0.9rem" }}>
                  <span>
                    {userData?.firstname} {userData?.lastname}
                  </span>
                </div>
              </div>
            </div>
            <hr
              style={{
                width: "95%",
                border: "0.1px solid #ececec",
                marginTop: "20px",
              }}
            />
          </div>

          {/* chatBox Messages */}

          <div className="chat-body">
            {messages.map((message) => (
              <>
                <div
                  ref={scroll}
                  className={
                    message.senderId === currentUserId
                      ? "message own"
                      : "message"
                  }
                >
                  <span>{message.text}</span>
                  <span>{format(message.createdAt)}</span>
                </div>
              </>
            ))}
          </div>

          {/* chat -sender */}
          <div className="chat-sender">
            <div>+</div>
            <InputEmoji value={newMessage} onChange={handleChange} />
            <div className="send-button button" onClick={handleSend}>
              Send
            </div>
          </div>
        </>
      ) : (
        <span className="chatbox-empty-message">
          Tap on a Chat to start Conversation...
        </span>
      )}
    </div>
  );
};

export default ChatBox;
