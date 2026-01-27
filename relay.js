const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const trackerData = {}; // store data per player

// Python posts tracker data here
app.post("/update/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    trackerData[playerId] = req.body;
    res.send({ status: "ok" });
});

// Roblox polls tracker data here
app.get("/get/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    res.json(trackerData[playerId] || {});
});

// Use the PORT that Render assigns (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));
