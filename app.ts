const express = require('express');
import { Request, Response } from "express";
const app = express();
const port = normalizePort(process.env.PORT || '3013');
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
import { NextFunction } from "express-serve-static-core";
// const mongoose = require("./database");
// import mongoose from "./database"
const mongoose = require('mongoose');
const session = require("express-session");
mongoose.connect("mongodb+srv://Admin:admin@liveproject.tynfk.mongodb.net/LiveProject?retryWrites=true&w=majority", 
    {useNewUrlParser:true, 
      useUnifiedTopology:true, 
      useCreateIndex: true, }, ()=>{
    console.log('connnected to DB')
  })

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { pingTimeout: 60000 });

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
}))

// Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logout');
const postRoute = require('./routes/postRoutes');
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');
const messagesRoute = require('./routes/messagesRoutes');
const notificationsRoute = require('./routes/notificationRoutes');

// Api routes
const postsApiRoute = require('./routes/api/posts');
const usersApiRoute = require('./routes/api/users');
const chatsApiRoute = require('./routes/api/chats');
const messagesApiRoute = require('./routes/api/messages');
const notificationsApiRoute = require('./routes/api/notifications');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);
app.use("/posts", middleware.requireLogin, postRoute);
app.use("/profile", middleware.requireLogin, profileRoute);
app.use("/uploads", uploadRoute);
app.use("/search", middleware.requireLogin, searchRoute);
app.use("/messages", middleware.requireLogin, messagesRoute);
app.use("/notifications", middleware.requireLogin, notificationsRoute);

app.use("/api/posts", postsApiRoute);
app.use("/api/users", usersApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages", messagesApiRoute);
app.use("/api/notifications", notificationsApiRoute);

app.get("/", middleware.requireLogin, (req:any, res:Response, next:NextFunction) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }

    res.status(200).render("home", payload);
})

io.on("connection", (socket:any) => {

    socket.on("setup", (userData:any) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join room", (room:any) => socket.join(room));
    socket.on("typing", (room:any) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room:any) => socket.in(room).emit("stop typing"));
    socket.on("notification received", (room:any) => socket.in(room).emit("notification received"));

    socket.on("new message", (newMessage:any) => {
        var chat = newMessage.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user:any) => {
            
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit("message received", newMessage);
        })
    });

})


function normalizePort(val:any) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }