import validator from 'validator';
import { IUser } from "../types";
import {
  maxAvatarLength, maxNameLength, minLength,
  urlPattern,
} from '../utils';

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const BadRequest400 = require('../errors/400');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    default: 'Жак-Ив Кусто',
    minLength,
    maxLength: maxNameLength,
  },
  about: {
    type: String,
    required: false,
    default: 'Исследователь',
    minLength,
    maxLength: maxAvatarLength,
  },
  avatar: {
    type: String,
    required: false,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: (v: string) => v.match(urlPattern),
  },
  email: {
    type: String,
    required: true,
    validate: (v: string) => validator.isEmail(v),
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false });

userSchema.static('findUserByCredentials', function findUserByCredentials(this: typeof userSchema, email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user: IUser) => {
      if (!user) {
        return Promise.reject(new BadRequest400());
      }

      return bcrypt.compare(password, user.password)
        .then((matched: boolean) => {
          if (!matched) {
            return Promise.reject(new BadRequest400());
          }

          return user;
        });
    });
});

export default mongoose.model('user', userSchema);
