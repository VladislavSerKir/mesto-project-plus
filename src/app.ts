import './env';
// import express, {
//   NextFunction, Request, Response, json,
// } from 'express';
import express, {
  json,
} from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes';
import {
  ERROR_CODE_404, ERROR_MESSAGE_404, maxAvatarLength, maxNameLength,
  minLength, passwordPattern,
} from './utils';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';

const { celebrate, Joi } = require('celebrate');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(json());
app.use(requestLogger);
app.use(cookieParser());
app.use(express.json());
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().pattern(new RegExp(passwordPattern)).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(minLength).max(maxNameLength),
    about: Joi.string().min(minLength).max(maxAvatarLength),
    avatar: Joi.string(),
    email: Joi.string().required().email(),
    password: Joi.string().pattern(new RegExp(passwordPattern)).required(),
  }),
}), createUser);
app.use(auth);
app.use(router);
app.use('*', (req, res) => {
  res.status(ERROR_CODE_404).send({ message: ERROR_MESSAGE_404 });
});
app.use(errorLogger);

async function connect() {
  try {
    mongoose.set('strictQuery', true);
    await app.listen(PORT, () => {
      console.log('Server listeting on port', PORT);
    });
    await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  } catch (err) {
    if (err instanceof mongoose.Error.MongooseServerSelectionError) {
      console.log('Ошибка подключения к базе данных');
    }
    console.log('Ошибка запуска сервера', err);
  }
}

connect();
