const express = require("express");

const router = express.Router();

router.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "FlowOps API is running",
        version: "bbd1b6e"
    });
});

module.exports = router;