const express = require('express');
import { Request, Response, NextFunction } from "express";
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const path = require("path");
const User = require('../schemas/UserSchema');

router.get("/images/:path",  (req:Request, res:Response, next:NextFunction) => {
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
})

module.exports = router;