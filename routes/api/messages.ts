import { Request, Response, NextFunction, Router } from "express";
import express from "express";
import bodyParser from "body-parser";
import User from "../../schemas/UserSchema";
import Post from "../../schemas/PostSchema";
import Chat from "../../schemas/ChatSchema";
import Message from "../../schemas/MessageSchema";
// import Notification from "../../schemas/NotificationSchema";
const Notification = require('../../schemas/NotificationSchema');

const app = express();
const router = Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req: any, res: Response, next: NextFunction) => {
  if (!req.body.content || !req.body.chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.session.user._id,
    content: req.body.content,
    chat: req.body.chatId,
  };

  Message.create(newMessage)
    .then(async (message: any) => {
      message = await message.populate("sender").execPopulate();
      message = await message.populate("chat").execPopulate();
      message = await User.populate(message, { path: "chat.users" });

      var chat = await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      }).catch((error: any) => console.log(error));

      insertNotifications(chat, message);

      res.status(201).send(message);
    })
    .catch((error: any) => {
      console.log(error);
      res.sendStatus(400);
    });
});

function insertNotifications(chat: any, message: any) {
  chat.users.forEach((userId: string) => {
    if (userId == message.sender._id.toString()) return;

    Notification.insertNotification(
      userId,
      message.sender._id,
      "newMessage",
      message.chat._id
    );
  });
}

export = router;
