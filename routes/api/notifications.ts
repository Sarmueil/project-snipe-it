import { Request, Response, NextFunction, Router } from "express";
import express from "express";
import bodyParser from "body-parser";
import User from "../../schemas/UserSchema";
import Post from "../../schemas/PostSchema";
import Chat from "../../schemas/ChatSchema";
import Message from "../../schemas/MessageSchema";
// import Notification from "../../schemas/NotificationSchema";
const Notification = require('../../schemas/NotificationSchema');
// import { boolean } from "joi";

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req: any, res: Response, next: NextFunction) => {
  var searchObj: any = {
    userTo: req.session.user._id,
    notificationType: { $ne: "newMessage" },
  };

  if (req.query.unreadOnly !== undefined && req.query.unreadOnly == "true") {
    searchObj.opened = false;
  }

  Notification.find(searchObj)
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then((results: any) => res.status(200).send(results))
    .catch((error: any) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.get("/latest", async (req: any, res: Response, next: NextFunction) => {
  Notification.findOne({ userTo: req.session.user._id })
    .populate("userTo")
    .populate("userFrom")
    .sort({ createdAt: -1 })
    .then((results: any) => res.status(200).send(results))
    .catch((error: any) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put("/:id/markAsOpened", async (req, res, next) => {
  Notification.findByIdAndUpdate(req.params.id, { opened: true })
    .then(() => res.sendStatus(204))
    .catch((error: any) => {
      console.log(error);
      res.sendStatus(400);
    });
});

router.put(
  "/markAsOpened",
  async (req: any, res: Response, next: NextFunction) => {
    Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
      .then(() => res.sendStatus(204))
      .catch((error: any) => {
        console.log(error);
        res.sendStatus(400);
      });
  }
);

export = router;
