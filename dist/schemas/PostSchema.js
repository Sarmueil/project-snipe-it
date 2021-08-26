"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// const mongoose = require('mongoose');
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const PostSchema = new Schema({
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweetData: { type: Schema.Types.ObjectId, ref: 'Post' },
    replyTo: { type: Schema.Types.ObjectId, ref: 'Post' },
    //pinned: Boolean
}, { timestamps: true });
var Post = mongoose_1.default.model('Post', PostSchema);
module.exports = Post;
//# sourceMappingURL=PostSchema.js.map