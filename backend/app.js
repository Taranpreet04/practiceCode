var createError = require('http-errors');
var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
require('dotenv').config();
var app = express();
app.use(cors());
var userModel = require("./model/users");
var messageModel = require('./model/messages')
const { upload } = require('./config/multerConfig');


// const multer = require("multer");
// const path = require("path");

// Storage settings
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Folder to save uploaded images
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = Date.now() + path.extname(file.originalname);
//     cb(null, uniqueName);
//   },
// });

// // Only allow images
// const fileFilter = (req, file, cb) => {
//   const allowed = /jpg|jpeg|png|gif/;
//   const isValid = allowed.test(file.mimetype);

//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files allowed"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
// });

var connectDb = require('./config/connectDb')
connectDb();
var server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000', // Ensure this matches your React app's origin
    methods: ['GET', 'POST'],
  }
}
);

app.use(cors({
  origin: ['http://localhost:4000'], // 👈 your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
let users = userModel.find();
io.on('connection', (socket) => {
  console.log('------------a user connected----------');

  socket.on('message', (data, callback) => {
    try {
      console.log("data", data)
      let message = new messageModel(data)
      console.log('message', message)
      message.save();
      let msg = userModel.find()
      callback(msg);
    }
    catch (err) {
    }
    // socket.emit('messageResponse', data);                       /*it receive message*/
  });
  // socket.emit('newUserResponse', users);

  socket.on('newUser', (data, callback) => {
    //Adds the new user to the list of users
    try {
      let userExist = userModel.findOne({ userName: data?.userName })
      if (!userExist) {
        let user = new userModel(data)
        user.save();
        callback(data)
      } else {
        callback(userExist)
        // console.log("user already exist")
      }
    }
    catch (err) {
      // console.log(err)
    }
  });

  socket.on('requestUserData', async () => {
    try {
      let data = await userModel.find();
      /* Emit the fetched data to the client*/
      socket.emit('userData', data);
    } catch (error) {
      socket.emit('userDataError', { message: 'Failed to fetch data' });
    }
  });
  socket.on('requestUserMessages', async () => {
    try {
      let data = await messageModel.find();
      /* Emit the fetched data to the client*/
      console.log("data from db==", data)
      socket.emit('messageData', data);
    } catch (error) {
      socket.emit('userDataError', { message: 'Failed to fetch data' });
    }
  });
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    //Updates the list of users when a user disconnects from the server
    // users = users?.filter((user) => user.socketID !== socket.id);
    //Sends the list of users to the client
    console.log("users at end--", users)
    socket.emit('userData', users);
    socket.disconnect();
  });
});




app.use("/uploads", express.static("uploads"));

// Upload Route
app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
      message: "Image uploaded successfully",
      file: req.file,
      url: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


/**
 * Listen on provided port, on all network interfaces.
 */
var port = process.env.PORT || 7000;
app.set('port', port);
server.listen(port);
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var StripeRouter = require('./routes/stripe');

// const { upload } = require('./config/multerConfig');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// app.get("/", (req, res)=>{
//   console.log("hello")
//   res.send({status: 200, title: 'Taran' })
// })
app.use('/', indexRouter);
app.use('/stripe', StripeRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
