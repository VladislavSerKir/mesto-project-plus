import './env';
import express, {
  NextFunction,
  json,
} from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cookieParser from 'cookie-parser';
import { requestLogger, errorLogger } from './middlewares/logger';
import router from './routes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import validationRegistrationData from './validation/registrationData';
import validationEmailPassword from './validation/emailPassword';

const NotFound404 = require('./errors/404');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(json());
app.use(requestLogger);
app.use(cookieParser());
app.use(express.json());
app.post('/signin', validationEmailPassword, login);
app.post('/signup', validationRegistrationData, createUser);
app.use(auth);
app.use(router);
app.use('*', (next: NextFunction) => {
  next(new NotFound404());
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
