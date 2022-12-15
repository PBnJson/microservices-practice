const express = require("express");
const cors = require("cors");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser")
const axios = require("axios");


const app = express();
app.use(bodyParser.json());
app.use(cors());

//stores all posts we create
const posts = {};

app.get("/posts", (req, res) => {
    res.send(posts);
})
// eventually have an ID for reqs, right now random generate
app.post("/posts/create", async (req, res) => {
    const id = randomBytes(4).toString("hex");
    const { title } = req.body;

    // adds new post to posts
    posts[id] = {
        id, title
    };
    console.log("object>>", id, title, posts)

    // event can have any structure you want but our event has a type and data.
    const eventPost = await axios.post("http://event-bus-srv:4005/events", {
        type: "PostCreated",
        data: {
            id, title
        }
    })
    console.log("log>>>", eventPost)
    res.status(206).send(posts[id]);


})

app.post("/events", (req, res) => {
    console.log("Recieved EVENT", req.body.type);

    res.send({});
})

app.listen(4000, () => {
    console.log("TESTING")
    console.log("LISTENING on 4000")
})