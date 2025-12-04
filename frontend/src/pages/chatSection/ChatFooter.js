import React, { useState } from 'react';

const ChatFooter = ({ socket, messages, setMessages }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && localStorage.getItem('userName')) {
      // console.log(message)
      const messageData = {
        text: message,
        userName: localStorage.getItem('userName'),
        // id: `${socket.id}${Math.random()}`, // Unique message ID
        socketID: socket?.id,
      };
      setMessage('');
      socket.emit('message', messageData, (response) => {
        //  console.log("response",response)

        // setMessages([...messages, response])
      });

      socket.emit('requestUserMessages');
      socket.on('messageData', (data) => {
        console.log("data from db==", data)
        setMessages(data)
      });

      return () => {
        socket.off('messageData');
      };
    }
   
  };
  // useEffect(() => {
  //   // socket.on('messageResponse', (data) => setMessages([...messages, data]));

  // }, [messages, setMessages, socket]);
  // //  console.log("messages", messages)
  return (
    <div className="chat__footer">
      <form className="form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Write message"
          className="message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button className="sendBtn">SEND</button>
      </form>
    </div>
  );
};

export default ChatFooter;