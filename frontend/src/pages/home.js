import { useState } from "react";
import { useNavigate } from "react-router-dom"
// import Card from "../components/card";
// import Editor from "../components/editor";
// import HtmlEditor from "../components/htmlEditor";
// import GeneratePdf from "../components/generatePdf";
// import axios from 'axios';
function Home({ socket }) {
    //  const [data, setData] = useState('')
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleSubmitt = (e) => {
        e.preventDefault();
        localStorage.setItem('userName', userName);
        socket.emit('newUser', { userName, socketID: socket.id }, (response) => {
            // console.log("response",response)
            // console.log("userRes==", response)
            //    setData(response)
        });
        // console.log("data=", data)
        navigate('/chat');
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const response = await axios.get('https://dummyjson.com/products');
    //         const result =  response?.data; // Make sure to parse the JSON
    //         setData(result); // Assuming setData is defined in your component
    //     };

    //     fetchData();
    //     }, [])
    //     console.log("data", data)
    return (
        <div>
            {/* <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className='btn btn-primary' onClick={() => alert(message)}>send</button> */}
            <form className="home__container" onSubmit={handleSubmitt}>
                <h2 className="home__header">Sign in to Open Chat</h2>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    minLength={3}
                    name="username"
                    id="username"
                    className="username__input"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button className="home__cta">SIGN IN</button>
                {/* <Card />
                <GeneratePdf />
               <Editor />
                <HtmlEditor /> */}
            </form>
        </div>
    )
}
export default Home;