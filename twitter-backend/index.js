import _ from 'lodash';
import { promises as fs } from 'fs';
import express from 'express';
import 'cors';
import {v4 as uuid} from 'uuid';
import { postTweet } from "./helpers/postTweet.js";
import { follow } from "./helpers/follow.js";
import { unfollow } from './helpers/unfollow.js';
import { getNewsFeed } from './helpers/getnewsfeed.js';

const app = express();
app.use(express.json());

const PORT = 3000;

app.get("/getNewsFeed/:id", getNewsFeed);
app.post("/postTweet", postTweet)
app.post("/follow/:id1/:id2", follow)
app.post("/unfollow/:id1/:id2", unfollow)

app.listen(PORT, () => console.log("Twitter API Server running at " + PORT + "..."));

// --------------------------- END of the code being used --------------------------------
// -------------------------------------------------------------------------------------
//Helper & few more Functions for Handling logic locally writing to files n all, based on specific operations
// -------------------------------------------------------------------------------------

//Extra - Not required as of now
// app.get("/tweet/:id", getTweet);

// async function getTweet(req, res){
//     const id = req.params.id;
//     let content;
//     try{
//         content = await fs.readFile(`data/tweets/${id}.txt`, "utf-8");
//     }catch (err) {
//         //TODO: Implement
//     }

//     res.json({
//         content: content
//     });
// }

// Non module based syntax for import statements
// const fetchNewsFeed_ = require("./helpers/getnewsfeed")
// const fs = require("fs/promises");
// const express = require("express");
// const cors = require("cors");
// const _ = ("lodash");
// const {v4: uuid} = require("uuid");

// function fetchNewsFeed(req, res){
//     res.send("Its still working");
// }

// async function postTweet(req, res){
//     const id = uuid();
//     const content = req.body.content;

//     if(!content){
//         return res.sendStatus(400);
//     }

//     await fs.mkdir("data/tweets", {recursive: true});
//     await fs.writeFile(`data/tweets/${id}.txt`, content);
//     // console.log(content);
//     res.status(201).json({
//         "id" : id
//     });
// }