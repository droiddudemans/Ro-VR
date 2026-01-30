const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const trackerData = {}; // { playerId: { data, lastUpdate } }

const INACTIVITY_LIMIT = 20 * 60 * 1000; // 20 minutes in ms

// Python posts tracker data here
app.post("/update/:playerId", (req, res) => {
    const playerId = req.params.playerId;

    trackerData[playerId] = {
        data: req.body,
        lastUpdate: Date.now()
    };

    res.send({ status: "ok" });
});

// Roblox polls tracker data here
app.get("/get/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    res.json(trackerData[playerId]?.data || {});
});

// Cleanup old players
setInterval(() => {
    const now = Date.now();

    for (const playerId in trackerData) {
        const inactiveTime = now - trackerData[playerId].lastUpdate;

        if (inactiveTime > INACTIVITY_LIMIT) {
            delete trackerData[playerId];
            console.log(`Removed inactive player: ${playerId} (inactive ${Math.round(inactiveTime/60000)} min)`);
        }
    }

}, 60 * 1000); // check every minute

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Relay running on port ${PORT}`));
