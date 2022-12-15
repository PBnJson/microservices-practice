const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// looks up comments by an associated post
commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
    //no matter what an array will be sent back
    res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
    // generate random id
    console.log("LOG", req.body)
    const commentId = randomBytes(4).toString("hex");

    // pull out content property from incoming request
    const { content } = req.body;

    // check to see if there is an array for a given Post ID, push the new comment to the comments Array
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id: commentId, content, status: "pending" });

    // assign comments array back to given post inside commentsByPostId object
    commentsByPostId[req.params.id] = comments;

    // This is everything getting sent over to the Event Bus, currently has nothing in Services to recieve events so it erros in /event-bus.
    // Need to create the endpoint now to recieve the events.
    await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentCreated",
        data: {
            id: commentId,
            content,
            // postId comes from the request handler in the parameter string
            postId: req.params.id,
            status: "pending"
        }
    })

    // send back the array of comments or just created comment
    res.status(207).send(comments);
});

app.post("/events", async (req, res) => {
    console.log("Recieved EVENT", req.body.type);
    const { type, data } = req.body;

    // update status
    if (type === "CommentModerated") {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        await axios.post("http://event-bus-srv:4005/events", {
            type: "CommentUpdated",
            data: {
                id,
                content,
                status,
                postId
            }
        })
    }
    res.send({});
})



app.listen(4001, () => {
    console.log("COMMENTS LISTENING ON 4001")
})