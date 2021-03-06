'use strict';

const EsCron = require('elasticsearch-cron'),
  _ = require('underscore'),
  redisUtil = require('./utils/redis'),
  mailUtil = require('./utils/mail');

const client = new EsCron({
  host: process.env.ES_URL || 'localhost:9200'
});

const start = cronPattern => {
  let search = client.search({ "match": { "log": "BitunnelRouteException" } }, cronPattern, 500);
  search.on('run', (data) => {
    // console.log('Came back with the result', data);
    if (data && data.hits && data.hits.hits) {
      let hits = data.hits.hits,
        errorArray = [];

      _.each(hits, hit => {
        if (hit && hit._source && hit._source.log) {
          let _log = hit._source.log;

          try {
            let json = JSON.parse(_log);

            let errorObject = {
              message: json.errorMessage.split('cause:')[1],
              exceptionType: json.exceptionType,
              time: hit._source["@timestamp"]
            };

            //remove first body element(key)
            if (json.body && typeof json.body === 'object' && json.body.length > 0) {
              json.body.shift();
              errorObject.objectReference = json.body[0];
              if (json.body.length > 1) errorObject.originUser = json.body[1]
            }

            if (json.routeHistory && json.routeHistory.length > 0)
              errorObject.startPoint = json.routeHistory[0].routeId;

            if (json.routeHistory && json.routeHistory.length > 1)
              errorObject.failurePoint = json.routeHistory[1].routeId;

            // console.log(errorObject);
            errorArray.push(errorObject);
          } catch (exception) {
            console.error(`An error occuured ${exception}`)
          }
        }
      })

      if (errorArray.length > 0) {
        // send mail to recipients
        redisUtil.getRecipientUserIds()
          .then((userIds) => {
            return redisUtil.getUserNameEmails(userIds);
          })
          .then((users) => {
            //remove odio errors;
            errorArray = _.map(errorArray, err => {
              if (err.startPoint && err.startPoint.includes('odio')) {

              } else return err;
            });

            return mailUtil.sendMail(users, errorArray);
          })
          .then((info) => {
            console.info(`Mail sent: ${info.response}`);
          })
          .catch((err) => {
            console.error(`An error occured, ${err}`);
          })
      } else {
        let date = new Date();
        console.info(`No Error occured at this time ${date}`);
      }
    }
  });

  search.on('error', (ex) => {
    console.error(`An error occured, ${ex}`);
  })
}

//get cron Pattern or run every 5 minutes
redisUtil.getCronPattern()
  .then((cronPattern) => {
    start(cronPattern || '0 */5  * * * *');
  })
  .catch((exp) => {
    console.error(exp);
  })

console.info(`Script started successfully...`);

/**
 * @Todo
 * Make script tenant based, 
 * Add tenant id to elastic payload
 */
