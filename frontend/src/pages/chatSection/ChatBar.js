 import React, { useEffect } from 'react';

 const ChatBar = ({ socket , users, setUsers}) => {
  
     useEffect(() => {
        socket.emit('requestUserData');
         socket.on('userData', (data)=>{
             setUsers(data);
          }); 
     return () => {
        socket.off('userData');
      };
   }, [socket, users, setUsers]);

   return (
     <div className="chat__sidebar">
       <h2>Open Chat</h2>
       <div>
         <h4 className="chat__header">ACTIVE USERS</h4>
         <div className="chat__users">
           {users.map((user) => (
             <p key={user.socketID}>{user.userName}</p>
           ))}
         </div>
       </div>
     </div>
   );
 };

 export default ChatBar;