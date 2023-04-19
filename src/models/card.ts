import { Schema } from "mongoose";

const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  // owner: {
  //   type: Schema.Types.ObjectId,
  //   required: true,
  // },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default mongoose.model('card', cardSchema);
