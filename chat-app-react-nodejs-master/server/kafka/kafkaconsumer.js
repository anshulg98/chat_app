const { Kafka } = require("kafkajs");
const axios = require("axios");
const mesg= require("../routes/messages")

const kafka = new Kafka({
	clientId: "myKafka3",
	brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "mygroupp1" });

consumer.connect();
consumer.subscribe({ topic: "messages2", fromBeginning: true });
module.exports = function () {
	consumer.run({
		eachMessage: async ({ message }) => {
			const msg_obj = JSON.parse(message.value);
			console.log(message.value.toString());

			console.log("MESSAGE IS INSIDE CONSUMER ");
			axios({
				method: "post",
				url: "http://localhost:5000/api/messages/receive/" + msg_obj.to,
				data: msg_obj,
			}).then((e) => {
				console.log("message successfully sent from consumer");
			});
			axios({
				method: "post",
				url: "http://localhost:5000/api/messages/addmsg/",
				data: msg_obj,
			}).then((e) => {
				console.log("message successfully sent to the db");
			});
            axios({
				method: "post",
				url: "http://localhost:5000/api/messages/getmsg/",
				data: msg_obj,
			}).then((e) => {
				console.log("message successfully sent to the db");
			});

			//console.log("message sent to client from consumer");
		},
	});
};

// const {Kafka} = require('kafkajs')
// //var io = require('socket.io').listen(8080);

// //const io = require('socket.io')
// //const socket = io('http://localhost:8080', { transports : ['websocket'] })
// //const soc=require('./index.js')
// const kafka = new Kafka({
//     clientId:"myKafka3",
//     brokers:["localhost:9092"]
// })

// const consumer = kafka.consumer({ groupId: 'mygroupp1'})

// consumer.connect()
// consumer.subscribe({ topic: 'messages1', fromBeginning: true})
// module.exports=function (){
// consumer.run({
//   eachMessage: async ({message}) => {
//     console.log(message.value.toString())
//     const msg_obj = JSON.parse(message.value)
//     console.log("INSIDE CONSUMER XXXXXXXXXXXXXXXXXXX")

//         //console.log(msg_obj)

//     socket.broadcast.emit('receive', msg_obj)
//    // soc(msg_obj)
//     console.log("message sent to client from consumer")
//     //console.log("XXXXXXXXXXXXXX")
//     //console.log(msg_obj)
//     //console.log(msg_obj.message)

//   }
// })}
