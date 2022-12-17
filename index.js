const axios = require('axios');
require('dotenv').config();

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'sa-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const _isLocal=process.env.IS_TEST;

const _senderOrReceiver = 'receiver';

senderRoutine = async function(event, context) {
    var params = {
        // Remove DelaySeconds parameter and value for FIFO queues
        DelaySeconds: 10,
        MessageAttributes: {
            "Brand": {
                DataType: "String",
                StringValue: "Fender"
            },
            "Strings": {
                DataType: "Number",
                StringValue: "6"
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

receiverRoutine = async function(event, context) {
    
    var queueURL = process.env.QUEUE_URL;

    var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 0
    };

    let body;

    try{
        const data = await sqs.receiveMessage(params).promise();
        
        body = data.Messages;
        
        console.log(body);

        for (const message of data.Messages) {
            console.log(message);
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: message.ReceiptHandle
              };
            await sqs.deleteMessage(deleteParams).promise();
        }

        

    }
    catch(err){
        console.log(err);
        body = err;
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    
    return response;

}

exports.handler = null;

if (_senderOrReceiver=='sender')
    exports.handler = senderRoutine;

if (_senderOrReceiver=='receiver')
    exports.handler = receiverRoutine;

if (_isLocal){
    let event = {};
    let context = {};
    exports.handler(event, context);
}