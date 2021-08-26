"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const validator = require('email-validator');
const dns_1 = require("dns");
app.set("view engine", "pug");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
router.get("/", (req, res, next) => {
    res.status(200).render("register");
});
router.post("/", async (req, res, next) => {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    const domain = email.split('@')[1];
    var password = req.body.password;
    const resolveEmail = await dns_1.promises
        .resolveMx(domain)
        .then((data) => {
        return true;
    })
        .catch((err) => {
        return false;
    });
    var payload = req.body;
    if (firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        });
        if (user == null) {
            // No user found
            if (!validator.validate(email)) {
                payload.errorMessage = "Incorrect email";
                return res.status(200).render("register", payload);
            }
            else if (!resolveEmail) {
                payload.errorMessage = "Invalid email";
                return res.status(200).render("register", payload);
            }
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data)
                .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            });
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);
            User.create(data)
                .then((user) => {
                req.session.user = user;
                return res.redirect("/");
            });
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already in use.";
            }
            else {
                payload.errorMessage = "Username already in use.";
            }
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value.";
        res.status(200).render("register", payload);
    }
});
module.exports = router;
//# sourceMappingURL=registerRoutes.js.map