import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import ejs from 'ejs';
import express from 'express';
import createError from 'http-errors';
import mongoose from 'mongoose';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import './app/models.js';

import router from './app/router.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connect('mongodb://localhost/ancestry', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch(err => {
  console.log('--- mongoose.connect() failed ---');
  console.log(err);
  console.log('\nIs mongod instance running?');
});

const app = express();

app.use(cors());

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('layout', {
    view: 'error',
    title: 'Error',
  });
});

export default app;
