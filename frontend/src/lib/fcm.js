import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../config/firebbaseConfig.js";

export const initFCM = async () => {
    try {
        if (typeof window === "undefined" || !("Notification" in window)) {
            console.log("Notifications not supported");
            return null;
        }

        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            console.log("Notification permission denied");
            return null;
        }

        const token = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
        });

        if (!token) {
            console.log("No token received");
            return null;
        }

        console.log("FCM Token:", token);
        return token;

    } catch (error) {
        console.error("Error initializing FCM:", error);
        return null;
    }
};

// Fixed: This now takes a callback and listens persistently
export const onMessageListener = (callback) => {
    onMessage(messaging, (payload) => {
        console.log("Foreground message received:", payload);
        callback(payload);
    });
};