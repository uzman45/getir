const Record = require('../models/req.model.js');
var isodate = require('isodate');
var moment=require('moment');

exports.getByFilter = (req, res) => {
    //parsing on request element for using json key value pairs
    var params = JSON.parse(Object.keys(req.body)[0]);
    //if missing expected parameter throw error and fail message
    if(!(params.minCount && params.maxCount && params.startDate && params.endDate)){
        res.status(422).send(
            {
                "code":1,
                "msg":"failed:missing parameters from (minCount,maxCount,endDate,startDate)",
               
            })
    }
    if(!(moment(params.startDate, 'YYYY-MM-DD',true).isValid()) || !(moment(params.endDate, 'YYYY-MM-DD',true).isValid() ))
    {
        res.status(422).send(
            {
                "code":2,
                "msg":"failed:date fields (end and start dates must be YYYY-MM-DD format",
               
            })
    }
    if(Date.parse(params.endDate) <= Date.parse(params.startDate)){
        res.status(422).send(
            {
                "code":3,
                "msg":"failed:date fields are not consistent.Enddate cannot be lower than startdate",
               
            })
    }
    if(params.minCount && params.maxCount && !(typeof params.minCount == 'number') ||!(typeof params.maxCount == 'number')){
        res.status(422).send(
            {
                "code":4,
                "msg":"failed:minCount and maxCount must be natural number"
               
            })
    }
    if(params.minCount && params.maxCount && params.maxCount <=params.minCount){
        res.status(422).send(
            {
                "code":5,
                "msg":"failed:minCount cannot equal or greater then maxCount"
               
            })
    }
    if(params.minCount && params.maxCount && (params.maxCount<0  || params.minCount<0)){
        res.status(422).send(
            {
                "code":6,
                "msg":"failed:minCount and maxCount must be natural number"
               
            })
    }
 
    //defines variables from params
    var startDate = params.startDate;
    var endDate = params.endDate;
    var minCount = params.minCount;
    var maxCount = params.maxCount;

    //Sum action on counts (nested array on records) and its called as totalCount to send to client
    Record.aggregate([
        {
            "$project": {
                //We prevent to display id value on API
                "_id" : 0,
                "key": "$key",
                "craetedAt": "$createdAt",
                "totalCount": {
                    "$sum": "$counts"
                },
                
            }
        },
        {
            //AND Queries totalCount and date checks
            "$match": {
                "$and": [
                    {
                        "totalCount": {
                            "$gte": minCount,
                            "$lte": maxCount
                        }
                    },

                    {
                        'craetedAt': {
                            "$gte": isodate(startDate),
                            "$lte": isodate(endDate)
                        }
                    }

                ]
            }
        }
    ])
        .then(dataFromAPI => {
            res.status(400).send(
                {
                    "code":0,
                    "msg":"success",
                    "records":dataFromAPI
                })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Error occured while fetch !"
            });
        })
}


