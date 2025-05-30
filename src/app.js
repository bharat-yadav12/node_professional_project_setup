import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))


app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"));
app.use(cookieParser());


// routes  import 
// may user route is not using in the index.js
import healthcheckRouter from "./routes/healthcheck.route.js"
import tweetRouter from "./routes/tweet.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.route.js"
import likeRouter from "./routes/like.route.js"
import playlistRouter from "./routes/playlist.route.js"
import dashboardRouter from "./routes/dashboard.route.js"




//routes declaration
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)


// custom middleware writing :-


// const logger = (req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
//   };
  
//   app.use(logger);



export {app};


// const express = require('express');
// const app = express();

// // Enable JSON parsing middleware
// app.use(express.json());

// // Enable URL-encoded bodies middleware
// app.use(express.urlencoded({ extended: true }));

// module.exports = app;   