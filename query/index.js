const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvents = (type, data) => {
    if (type === "PostCreated") {
        // every post event will have an ID and Title that we want from "data"
        const { id, title } = data;

        // inserted in posts object (refer to notes)
        posts[id] = { id, title, comments: [] }
    }
    if (type === "CommentCreated") {
        const { id, content, postId, status } = data;

        // finding the appropriate post to go with the comment, then push in new comment with an id and content
        const post = posts[postId]
        post.comments.push({ id, content, status })
    }

    if (type === "CommentUpdated") {
        const { id, content, status, postId } = data;

        const post = posts[postId];
        const comment = post.comments.find((comment) => {
            return comment.id === id;
        });

        comment.status = status;
        comment.content = content;
    }
}

app.get("/posts", (req, res) => {
    res.send(posts);
})

app.post("/events", (req, res) => {
    const { type, data } = req.body;

    handleEvents(type, data);

    res.send({})
})

app.listen(4002, async () => {
    console.log("QUERY listening 4002");
    try {
        const res = await axios.get("http://event-bus-srv:4005/events");

        for (let event of res.data) {
            console.log("Processing Event->", event.type);
            handleEvents(event.type, event.data);

        }
    } catch (error) {
        console.log(error.message);
    }

})

// When... we get PostCreated we save a post
// When... we get CommentCreated we save a comment to an associted postId
// Finally... update the React app to pull appropriate data