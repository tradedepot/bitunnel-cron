let es = require('elasticsearch'),
    _ = require('underscore'),
    CronJob = require('cron').CronJob,
    cronParser = require('cron-parser'),
    moment = require("moment");

class ElasticsearchCron {
    constructor(config) {
        this.esFac = es.Client(config);
    }
}

ElasticsearchCron.prototype.search = function(query, time, autoIncrement) {
    try {
        let self = this;
        let searchJob = new CronJob({
            cronTime: time,
            onTick: function() {
                let currentDate = new Date();
                let nextTime = getTimeRange(time, currentDate);
                console.log(nextTime)

                self.esFac.search({
                    size: 1000,
                    body: {
                        query: {
                            "bool": {
                                "must": [
                                    query, {
                                        "range": {
                                            "@timestamp": {
                                                "gte": lastRun(nextTime),
                                                "lte": currentDate
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    }
                })
            },
            start: false
        })

        searchJob.start();

    } catch (ex) {
        console.log("cron pattern not valid");
    }
}


function getTimeRange(cronTime, currentDate) {
    let options = {
        currentDate,
        iterator: true
    };
    try {
        var interval = cronParser.parseExpression(cronTime, options)
        return interval.next().value.toDate();
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}

function lastRun(currentTime, runDuration) {
    let c = moment(currentTime);
    console.log(c.toDate(), "djskj")
    let d = c.subtract(runDuration);
    console.log(d.toDate(), "kfsk")
    return d.toDate();
}

module.exports = ElasticsearchCron;
