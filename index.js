let lib = require('./lib')
    // jobs = require('/jobs/jobs.js'),
    // mail = require('/mail/mail.js');

let client = new lib({
    host: process.env.ES_HOST.concat(':').concat(process.env.ES_PORT) || 'localhost:9200',
    log: 'trace'
});

console.log(client.search({ "match": { "log": "BitunnelRouteException" } }, '* * * * * *'))
