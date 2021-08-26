"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
// import Notification from "../../schemas/NotificationSchema";
const Notification = require('../../schemas/NotificationSchema');
// import { boolean } from "joi";
const app = express_1.default();
const router = express_1.default.Router();
app.use(body_parser_1.default.urlencoded({ extended: false }));
router.get("/", async (req, res, next) => {
    var searchObj = {
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
        .then((results) => res.status(200).send(results))
        .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});
router.get("/latest", async (req, res, next) => {
    Notification.findOne({ userTo: req.session.user._id })
        .populate("userTo")
        .populate("userFrom")
        .sort({ createdAt: -1 })
        .then((results) => res.status(200).send(results))
        .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});
router.put("/:id/markAsOpened", async (req, res, next) => {
    Notification.findByIdAndUpdate(req.params.id, { opened: true })
        .then(() => res.sendStatus(204))
        .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});
router.put("/markAsOpened", async (req, res, next) => {
    Notification.updateMany({ userTo: req.session.user._id }, { opened: true })
        .then(() => res.sendStatus(204))
        .catch((error) => {
        console.log(error);
        res.sendStatus(400);
    });
});
module.exports = router;
//# sourceMappingURL=notifications.js.map