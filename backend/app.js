const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connectDb = require('./config/connectDb');
connectDb();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:4000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static("uploads"));

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const stripeRouter = require('./routes/stripe');
const uploadRouter = require('./routes/upload');
const geminiRouter = require('./routes/gemini');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/stripe', stripeRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/gemini', geminiRouter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
