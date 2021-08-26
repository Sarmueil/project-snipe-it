const express = require('express');
import { Request, Response, NextFunction } from "express";
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

router.get("/", (req:any, res:Response, next:NextFunction) => {
    var payload = createPayload(req.session.user)
    res.status(200).render("searchPage", payload);
})

router.get("/:selectedTab", (req:any, res:Response, next:NextFunction) => {
    var payload:any = createPayload(req.session.user)
    payload.selectedTab = req.params.selectedTab;
    res.status(200).render("searchPage", payload);
})

function createPayload(userLoggedIn:any) {
    return {
        pageTitle: "Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    };
}

module.exports = router;