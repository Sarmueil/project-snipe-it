const express = require('express');
import { Request, Response, NextFunction } from "express";
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/PostSchema');
const Chat = require('../../schemas/ChatSchema');
const Message = require('../../schemas/MessageSchema');

app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req:any, res:Response, next:NextFunction) => {
    if(!req.body.users) {
        console.log("Users param not sent with request");
        return res.sendStatus(400);
    }

    var users = JSON.parse(req.body.users);

    if(users.length == 0) {
        console.log("Users array is empty");
        return res.sendStatus(400);
    }

    users.push(req.session.user);

    var chatData = {
        users: users,
        isGroupChat: true
    };

    Chat.create(chatData)
    .then((results:any) => res.status(200).send(results))
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/", async (req:any, res:Response, next:NextFunction) => {
    Chat.find({ users: { $elemMatch: { $eq: req.session.user._id } }})
    .populate("users")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results:any) => {

        if(req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
            results = results.filter((r:any) => r.latestMessage && !r.latestMessage.readBy.includes(req.session.user._id));
        }

        results = await User.populate(results, { path: "latestMessage.sender" });
        res.status(200).send(results)
    })
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/:chatId", async (req:any, res:Response, next:NextFunction) => {
    Chat.findOne({ _id: req.params.chatId, users: { $elemMatch: { $eq: req.session.user._id } }})
    .populate("users")
    .then((results:any) => res.status(200).send(results))
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:chatId", async (req:any, res:Response, next:NextFunction) => {
    Chat.findByIdAndUpdate(req.params.chatId, req.body)
    .then((results:any) => res.sendStatus(204))
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/:chatId/messages", async (req:any, res:Response, next:NextFunction) => {
    
    Message.find({ chat: req.params.chatId })
    .populate("sender")
    .then((results:any) => res.status(200).send(results))
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.put("/:chatId/messages/markAsRead", async (req:any, res:Response, next:NextFunction) => {
    
    Message.updateMany({ chat: req.params.chatId }, { $addToSet: { readBy: req.session.user._id } })
    .then(() => res.sendStatus(204))
    .catch((error:Error) => {
        console.log(error);
        res.sendStatus(400);
    })
})

module.exports = router;