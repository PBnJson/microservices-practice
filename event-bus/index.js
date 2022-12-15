const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
// const cors = require("cors");

const app = express();
app.use(bodyParser.json())
// app.use(cors());

const events = [];

// POST req handler to listen for incoming events. Event recieved and sent to servers. Maybe add a try catch in case one of the events fails.
app.post("/events", (req, res) => {
    // This is what gets sent.
    console.log("REQ>>", req.body)
    try {
        const event = req.body;

        events.push(event);

        axios.post("http://posts-clusterip-srv:4000/events", event);
        axios.post("http://comments-srv:4001/events", event);
        axios.post("http://query-srv:4002/events", event);
        axios.post("http://moderation-srv:4003/events", event);


        res.send({ status: "OK" });
    } catch (error) {
        console.log("ERROR", error)
    }

});

app.get("/events", (req, res) => {
    res.send(events);
})

app.listen(4005, () => {
    console.log("EVENT BUS on 4005");
})