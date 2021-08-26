// const mongoose = require('mongoose');
import mongoose from "mongoose"
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

export = mongoose.model('Chat', chatSchema);