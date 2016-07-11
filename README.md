# Bitunnel ElasticSearch Cron Job

## Description
This NodeJs based application contains scripts that queries bitunnel elastic search for errors, parses the error and sends the messages to select users as defined in Redis. Fully dockerized and hosted on kubernetes.

## Configuration and ENV variables
*Elastic Search*
Elasticsearch host and post; 
ES_URL
```
export ES_URL=localhost:9200
```

*Mail*
MAIL_URL
```
export MAIL_URL=smtps://user@mail.com:pass@smtp.mail.com
```

*Redis*
REDIS_MASTER
REDIS_PORT
```
export REDIS_MASTER=127.0.0.1
export REDIS_PORT=6379
```

