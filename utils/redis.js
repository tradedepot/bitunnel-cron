'use strict';
const _ = require('underscore'),
  redis = require('redis');

const redisClient = redis.createClient(
  process.env.REDIS_PORT, process.env.REDIS_MASTER
)

exports.getRecipientUserIds = () => {
  return new Promise((res, rej) => {
    redisClient.smembers('bitunnel-admin-users', (err, r) => {
      if (err) rej(err);
      res(r);
    });
  });
}

exports.getUserNameEmails = (userIds) => {
  let result = [];
  _.each(userIds, (userId) => {
    let data = new Promise((res, rej) => {
      redisClient.hmget(userId, 'name', 'email', (err, data) => {
        if (err) rej(err);
        data = {
          name: data[0],
          email: data[1]
        }
        res(data);
      })
    });
    result.push(data);
  })

  return Promise.all(result);
}

exports.getCronPattern = () => {
  return new Promise((res, rej) => {
    redisClient.get('cronPattern', (err, data) => {
      if (err) rej(err);
      res(data);
    })
  })
}
