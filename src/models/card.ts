import { Schema } from "mongoose";
import validator from 'validator';

import { maxNameLength, minLength } from "../utils";

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength,
    maxLength: maxNameLength,
  },
  link: {
    type: String,
    required: true,
    validate: (v: string) => validator.isURL(v, { protocols: ['http', 'https', 'ftp'], require_tld: true, require_protocol: true }),
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],

  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default mongoose.model('card', cardSchema);
