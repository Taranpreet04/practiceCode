import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBody = ({socket, messages, setMessages }) => {
  const navigate = useNavigate();

  const handleLeaveChat = () => {
    localStorage.removeItem('userName');
    navigate('/');
    window.location.reload();
  };
  useEffect(() => {
    socket.emit('requestUserMessages');
     socket.on('messageData', (data)=>{
      // console.log("data from db==", data)
         setMessages(data);
      }); 

 return () => {
    socket.off('messageData');
  };
}, [socket, messages, setMessages]);

// useEffect(() => {
//   socket.on('messageResponse', (data) => setMessages([...messages, data]));
// }, [socket, messages]);
// console.log("messages", messages)
  return (
    <>
    <header className="chat__mainHeader">
      <p>Hangout with Colleagues</p>
      <button className="leaveChat__btn" onClick={handleLeaveChat}>
        LEAVE CHAT
      </button>
    </header>

    <div className="message__container">
      {messages.map((message) =>
        message.userName === localStorage.getItem('userName') ? (
          <div className="message__chats" key={message.id}>
            <p className="sender__name">You</p>
            <div className="message__sender">
              <p>{message.text}</p>
            </div>
          </div>
        ) : (
          <div className="message__chats" key={message.id}>
            <p className='recipient_name'>{message.userName}</p>
            <div className="message__recipient">
              <p>{message.text}</p>
            </div>
          </div>
        )
      )}

      {/* <div className="message__status">
        <p>Someone is typing...</p>
      </div> */}
    </div>
  </>
  );
};

export default ChatBody;