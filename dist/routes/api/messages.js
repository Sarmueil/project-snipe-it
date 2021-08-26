"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserSchema_1 = __importDefault(require("../../schemas/UserSchema"));
const ChatSchema_1 = __importDefault(require("../../schemas/ChatSchema"));
const MessageSchema_1 = __importDefault(require("../../schemas/MessageSchema"));
// import Notification from "../../schemas/NotificationSchema";
const Notification = require('../../schemas/NotificationSchema');
const app = express_2.default();
const router = express_1.Router();
app.use(body_parser_1.default.urlencoded({ extended: false }));
router.post("/", async (req, res, next) => {
    if (!req.body.content || !req.body.chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.session.user._id,
        content: req.body.content,
        chat: req.body.chatId,
    };
    MessageSchema_1.default.create(newMessage)
        .then(async (message) => {
        message = await message.populate("sender").execPopulate();
        message = await message.populate("chat").execPopulate();
        message = await UserSchema_1.default.populate(message, { path: "chat.users" });
        var chat = await ChatSchema_1.default.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        }).catch((error) => console.log(error));
        insertNotifications(chat, message);
        res.status(201).send(message);
    })
        .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});
function insertNotifications(chat, message) {
    chat.users.forEach((userId) => {
        if (userId == message.sender._id.toString())
            return;
        Notification.insertNotification(userId, message.sender._id, "newMessage", message.chat._id);
    });
}
module.exports = router;
//# sourceMappingURL=messages.js.map