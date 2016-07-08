let es = require('elasticsearch'),
  _ = require('underscore'),
  CronJob = require('cron').CronJob,
  cronParser = require('cron-parser'),
  moment = require("moment");

const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();


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
        let lastRun = getTimeRange(time, currentDate);

        console.log("currentTime", currentDate.toISOString())
        console.log("lastRun", lastRun)
        console.log("____=======================================___\n")

        self.esFac.search({
          size: 1000,
          body: {
            query: {
              "bool": {
                "must": [
                  query, {
                    "range": {
                      "@timestamp": {
                        "gte": lastRun,
                        "lte": currentDate
                      }
                    }
                  }
                ]
              }
            }
          }
        }).then((data) => {
          //emit results
          myEmitter.emit('run', data);
        })
      },
      start: true
    })
  } catch (ex) {
    console.log(`An error occured, ${ex}`);
  }
  return myEmitter;
}


function getTimeRange(cronTime, currentDate) {
  let options = {
    currentDate,
    iterator: true
  };
  try {
    let interval = cronParser.parseExpression(cronTime, options)
    let next = interval.next().value.toISOString();

    return lastRun(currentDate, next);
  } catch (err) {
    console.log('Error: ' + err.message);
  }
}

function lastRun(currentTime, nextTime) {

  currentTime = currentTime.toISOString();
  let _current = moment(currentTime);
  let _next = moment(nextTime);

  let duration = _next.diff(currentTime);
  let lastRun = _current.subtract(duration);

  return lastRun.toDate();
}

module.exports = ElasticsearchCron;
