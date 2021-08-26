"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose_1.default.model('Message', messageSchema);
//# sourceMappingURL=MessageSchema.js.map