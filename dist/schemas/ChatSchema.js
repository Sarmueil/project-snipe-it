"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const chatSchema = new Schema({
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });
module.exports = mongoose_1.default.model('Chat', chatSchema);
//# sourceMappingURL=ChatSchema.js.map