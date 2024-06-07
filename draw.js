require('dotenv').config();
var colors = require('colors');

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'sa-east-1'});

// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const total=50;

String.prototype.lpad = function(padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

async function receiverRoutine(event, context) {
    
    var queueURL = process.env.QUEUE_URL;

    var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 20,
    WaitTimeSeconds: 5
    };

    let body;

    try{
        const data = await sqs.receiveMessage(params).promise();
        let result = '';
        body = data.Messages;
        for (const message of data.Messages) {
            var deleteParams = {
                QueueUrl: queueURL,
                ReceiptHandle: message.ReceiptHandle
              };
            result =  message.MessageAttributes["drawCount"]["StringValue"]+"@"+
            message.MessageAttributes["color"]["StringValue"]+"@"+
            message.MessageAttributes["length"]["StringValue"];
            await sqs.deleteMessage(deleteParams).promise();
        }
        
        return result;

    }
    catch(err){
        return 0;
    }

}

async function print(total, color, length){
    let token="";
    for (let i=0; i<length; i++)
        token+="█";

    for(let i=0; i<total; i++) {
        eval("console.log(token."+color+");");
        await delay(80);
    }  
}

async function init(){
    while (true){
        await delay(1500);        
        
        let result = await receiverRoutine();
        
        if (result == 0) 
            continue;

        let total = result.split("@")[0];
        let color = result.split("@")[1];
        let length = result.split("@")[2];
              
        print(total, color, length);
        
    }
}

init();
