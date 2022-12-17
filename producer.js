const axios = require('axios');
var colors = require('colors');
require('dotenv').config();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'sa-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
async function send(total, color) {
    const s = total.toString();
    var params = {
        // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,
        MessageAttributes: {
            "drawCount": {
                DataType: "Number",
                StringValue: s
            },
            "color": {
                DataType: "String",
                StringValue: color
            }
        },        
        MessageBody: "{ \"message\": \"Hello Guitar!\"}",

        QueueUrl: process.env.QUEUE_URL
    };

    let body;

    try{
        const data = await sqs.sendMessage(params).promise();
        body = data.MessageId;
    }
    catch(err){
        console.log(err);
        body=err;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
}


function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}
function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}



async function init(){
    const lista = ["green","red","blue","rainbow","yellow"];
    while (true) {
        const total = getRndInteger(1, 50);
        const totalColor = getRndInteger(0, 4);
        //eval('console.log("hello".rainbow)');
        //console.log('hello'.rainbow);
        console.log("to generate: " + total);
        console.log("color: " + lista[totalColor]);
        send(total, lista[totalColor]);
        await delay(2000);
    }
}

init();