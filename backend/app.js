import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
console.log("__filename", __filename);
const __dirname = path.dirname(__filename);
console.log("__dirname", __dirname);

import connectDb from './config/connectDb.js';
connectDb();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:4000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static("uploads"));
console.log("app.js started (ESM)");

// Routes
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import stripeRouter from './routes/stripe.js';
import uploadRouter from './routes/upload.js';
import geminiRouter from './routes/gemini.js';
import pinterestRouter from './routes/pinterestRoutes.js';

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/gemini', geminiRouter);
app.use('/api/pinterest', pinterestRouter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


const filePath = path.join(__dirname, 'test.txt');
console.log("filePath", filePath);
// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const PORT = 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
