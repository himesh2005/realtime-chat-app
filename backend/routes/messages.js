const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:userId", auth, async (req, res) => {
  try {
    const myId = req.userId;
    const otherId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { from: myId, to: otherId },
        { from: otherId, to: myId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
