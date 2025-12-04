import React, { useState} from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from "./ChatFooter";
// import {useLocation} from 'react-router-dom';

const Chat = ({ socket }) => {
  // const location = useLocation();
  const [users, setUsers] = useState([]);
  // console.log("====",socket?.id)
  const [messages, setMessages] = useState([]);


  // console.log("messages------", messages, location.state)
  return (
    <div className="chat">
      <ChatBar socket={socket} users={users}  setUsers={setUsers}/>
      <div className="chat__main">
        <ChatBody socket={socket} messages={messages} setMessages={setMessages}/>
        <ChatFooter socket={socket}  messages={messages}  setMessages={setMessages}/>
      </div>
    </div>
  );
};

export default Chat;