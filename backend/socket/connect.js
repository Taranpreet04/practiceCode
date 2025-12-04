var server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Ensure this matches your React app's origin
    methods: ['GET', 'POST'],
  }
}
);
io.on('connection', (socket) => {
    console.log('------------a user connected----------');

    socket.on('message', (data, callback) => {
      console.log(`Message from ${data.name}: ${data.text}`);
      callback(data);
    });

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
    });
  });
  