import './env';
import express, {
  NextFunction, Request, Response, json,
} from 'express';
import mongoose from 'mongoose';
import path from 'path';

import router from './routes';
import { CustomRequest } from './types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(json());

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestCustom = req as CustomRequest;
  requestCustom.user = {
    _id: '644022682e1d30a07909beee',
  };

  next();
});

app.use(router);
app.get('*', function (req, res) {
  res.status(404).send(res.statusCode);
});

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
