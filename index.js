'use strict';
const doc = require('dynamodb-doc');
const uuid = require('uuid/v4');

const dynamo = new doc.DynamoDB();

exports.handler = (event, context, callback) => {
   var stage = event.context.stage;
   var userId= event.context['user-sub'];
   var method = event.context['http-method'];
   switch(method){
    case "GET":
        getAllContactPoints(event,callback)
        break;
    case "POST":
        addNewContactPoint(event,callback);
        break;
    default:
    callback(null, JSON.stringify(event));
   }
   
};

function addNewContactPoint(event,callback){
   var stage = event.context.stage;
   var userId= event.context['user-sub'];
   var obj = event["body-json"];
   var params = {
        TableName: "user-contact-points-"+stage,
        Item:{
            "user-id":userId,
            "contact-point-id":uuid(),
            "contact-point-name":obj["contact-point-name"]
        }
    };
   dynamo.putItem(params,function(err,data){
        if(err){
            err.text = "ERR";
            callback(null,JSON.stringify(err));
        }
        else{
            data.text = "TEXT";
            callback(null,JSON.stringify(data));
        }
    });
    //callback(null,dynamo.putItem);
    return;

    
}

function getAllContactPoints(event, callback){
   var stage = event.context.stage;
   var userId= event.context['user-sub'];
   var params = {
        TableName: "user-contact-points-"+stage,
        KeyConditionExpression: "#userid = :userid",
        ExpressionAttributeNames:{
            "#userid":"user-id"
        },
        ExpressionAttributeValues: {
            ":userid": userId.toString()
        }
    };
    dynamo.query(params,function(err,data){
        if(err)
            callback(null,JSON.stringify(err));
        else
            callback(null,JSON.stringify(data));
    });
}