import { Input, Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { initFCM, onMessageListener } from "../../lib/fcm";
import { toast } from "react-toastify";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fcmToken, setFcmToken] = useState('');

    const handleLogin = async () => {
        console.log(email, password);
        try {
            const response = await axios.post("http://localhost:7000/login", {
                email,
                password,
                fcmToken,
            });
            console.log("data==", response.data);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            toast.success("Login successfully");
        } catch (error) {
            console.error("Login failed:", error);
        }
    }
    useEffect(() => {
        const fetchToken = async () => {
            const token = await initFCM();
            console.log("fcmToken===", token);
            setFcmToken(token);
        };
        fetchToken();

        onMessageListener((payload) => {
            console.log("Notification payload:", payload);
            toast.info(`${payload.notification.title}: ${payload.notification.body}`, {
                position: "top-right",
            });
        });
    }, []);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "50%" }}>
            <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="primary" onClick={handleLogin}>Login</Button>

            <button onClick={async () => {
                try {
                    let res = await axios.post("http://localhost:7000/send-notification", {
                        userId: JSON.parse(localStorage.getItem("user")).id,
                    })
                    console.log("res", res)
                } catch (error) {
                    console.error("Error sending notification:", error);
                }
            }}>check notification</button>
        </div>
    )
}
export default Login   
