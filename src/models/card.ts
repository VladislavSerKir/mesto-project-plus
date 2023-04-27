import { Schema } from "mongoose";
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
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'user', default: [] }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

export default mongoose.model('card', cardSchema);
