// import logo from './logo.svg';
import { io } from 'socket.io-client';

import './App.css';
import { Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout';
import Home from './pages/home';
import Chat from './pages/chatSection/chatIndex';
import StripePayment from './pages/StripePayment.js';
import UploadImage from './pages/uploadImage.js/index.js';
// import { useEffect, useState } from 'react';
function App() {
  // const [socket, setSocket]= useState(null)
  let socketInstance = io(process.env.REACT_APP_BASE_URL);
  console.log("res", socketInstance)
  // useEffect(()=>{
  // //  let res = socketIO.connect(process.env.REACT_APP_BASE_URL);
  //  if(socketInstance){
  //   setSocket(socketInstance)
  //  }
  //  return () => {
  //   socketInstance.disconnect();
  // };
  // }, [socketInstance])
  //  const socket2 = io(process.env.REACT_APP_BASE_URL);
  // // const socket = socketIO.connect(process.env.REACT_APP_BASE_URL);
  // console.log("socket----", socket2.id, process.env.REACT_APP_BASE_URL)

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home socket={socketInstance} />} />
          <Route path="chat" element={<Chat socket={socketInstance} />} />
          <Route path="stripe" element={<StripePayment />} />
          <Route path="upload" element={<UploadImage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
