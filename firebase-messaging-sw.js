// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
firebase.initializeApp({
    apiKey: "AIzaSyAxi-7xEvsmZt4Ym6Z0ARXAWaczQNlQF08",
    authDomain: "e-commerce-37919.firebaseapp.com",
    projectId: "e-commerce-37919",
    storageBucket: "e-commerce-37919.firebasestorage.app",
    messagingSenderId: "347749647162",
    appId: "1:347749647162:web:7260ace74cbb0f2f6e0603",
    measurementId: "G-5J1X7ZQYW6"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// This is triggered when a message is received in the background
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    const notificationTitle = payload.notification.title || 'New Message';
    const notificationOptions = {
        body: payload.notification.body || 'You have a new message.',
        icon: '/logo192.png',
        badge: '/logo192.png', // Small icon for the notification bar
        tag: 'chat-notification', // Groups notifications together
        data: payload.data
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Force the service worker to take control immediately
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
