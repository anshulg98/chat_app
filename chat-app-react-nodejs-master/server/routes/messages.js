const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
var producer = require("../kafka/kafkaproducer.js");
const messageController = require("../controllers/messageController");
router.post("/send", (req, res) => {
	producer(req.body); //message.push(req.body); //msg saved in array (producerfunction)
	//console.log(898, req.body);
	console.log("msg sent to producer");
	res.send("item added " + req.body);
});

router.post("/receive/:username", (req, res) => {
	res.send(req.body);
	console.log("msg received by " + req.body.to + " from " + req.body.from);
});

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;
