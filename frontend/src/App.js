// import logo from './logo.svg';
import { io } from 'socket.io-client';

import './App.css';
import { Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout';
import Home from './pages/home';
import Chat from './pages/chatSection/chatIndex';
import StripePayment from './pages/StripePayment.js';
import UploadImage from './pages/uploadImage.js/index.js';
import GeminiAi from './components/geminiAi.js';
import Plans from './components/plans.js';
import Products from './pages/products/index.js';
import Pinterest from './pages/Pinterest/index.jsx';
import ChapterGenerator from './components/ChapterGenerator/ChapterGenerator.jsx';
import ImageComment from './pages/ImageComment.js';
import ImportExcel from './pages/ImportExcel/index.js';
import Property from './pages/property.js';
import Login from './pages/login/index.js';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { ScrollTest } from './pages/scrolTest.js';
function App() {
  // const [socket, setSocket] = useState(null)
  // let socketInstance = io(process.env.REACT_APP_BASE_URL);
  // console.log("res", socketInstance)


  // useEffect(() => {
  //   //  let res = socketIO.connect(process.env.REACT_APP_BASE_URL);
  //   if (socketInstance) {
  //     setSocket(socketInstance)
  //   }
  //   return () => {
  //     socketInstance.disconnect();
  //   };
  // }, [socketInstance])
  // const socket2 = io(process.env.REACT_APP_BASE_URL);
  // const socket = socketIO.connect(process.env.REACT_APP_BASE_URL);
  // console.log("socket----", socket2.id, process.env.REACT_APP_BASE_URL)

  return (
    <div className="App">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="login" element={<Login />} />
          {/* <Route index element={<Home socket={socketInstance} />} />
          <Route path="chat" element={<Chat socket={socketInstance} />} /> */}
          <Route path="chat" element={<Chat socket={null} />} />
          <Route path="stripe" element={<StripePayment />} />
          <Route path="scroll" element={<ScrollTest />} />

          <Route path="upload-image" element={<UploadImage />} />
          <Route path="gemini" element={<GeminiAi />} />
          <Route path="plans" element={<Plans />} />
          <Route path="products" element={<Products />} />
          <Route path="pinterest" element={<Pinterest />} />
          <Route path="chapters" element={<ChapterGenerator />} />
          <Route path="import-excel" element={<ImportExcel />} />
          <Route path="image-comment" element={<ImageComment />} />
          <Route path="property" element={<Property />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
