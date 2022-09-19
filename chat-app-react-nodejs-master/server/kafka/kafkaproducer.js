const { Kafka } = require("kafkajs");
const consumer = require("./kafkaconsumer");
const kafka = new Kafka({
	clientId: "myKafka3",
	brokers: ["localhost:9092"],
});

const producer = kafka.producer();

//const msg = {From:"Vaibhav", To: "Nobody", Content: "Hello Nobody!"}
//const msg2 = {message: "Hello there!", name: "vaibhav"}
//console.log("producer");
producer.connect();

module.exports = function (message) {
	producer.send({
		topic: "messages2",
		messages: [
			{
				value: JSON.stringify(message),
			},
		],
	});
};

// const {Kafka} = require('kafkajs')

// const kafka = new Kafka({
//     clientId:"myKafka3",
//     brokers:["localhost:9092"]
// })

// const producer = kafka.producer()

// //const msg = {From:"Vaibhav", To: "Nobody", Content: "Hello Nobody!"}
// //const msg2 = {message: "Hello there!", name: "vaibhav"}
// producer.connect()
// //const run = async () =>{
//     //await producer.connect()
//     module.exports=function(message){

//      producer.send({
//       topic: "messages1",
//       messages: [{
//         value: JSON.stringify(message)
//       }]
//     })
// }

//run().then((data) => console.log("data sent")).catch((err)=> console.log(err))
