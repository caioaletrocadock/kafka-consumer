const dotenv = require('dotenv');
const parseArgs = require('minimist');
const path = require('path');
const { Kafka, logLevel }  = require('kafkajs');
const AWS = require('aws-sdk');

const { env } = parseArgs(process.argv.slice(2));

dotenv.config({
  path: path.resolve(process.cwd(), `.env${env ? `.${env}` : ''}`),
});

const options = {
    clientId: 'qualquercoisa',
    brokers: process.env.KAFKA_BROKERS.split(','),
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-512',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
    },
    connectionTimeout: 5000,
    requestTimeout: 10000,
    logLevel: logLevel.INFO
}

const consumeKafka = async () => {
  let kafka = new Kafka(options)
  let instance = kafka.consumer({ groupId: 'troti-local-consumer' })
  await instance.connect()
  await instance.subscribe({ topic: 'kfk.dev.core.eitri.company' })
  await instance.run({
    eachMessage: async ({ topic, partition, message }) => {
      let msg = JSON.parse(message.value.toString())
      console.log({
        value: msg,
      })
    },
  })}

(async ()=> {
  await consumeKafka();
})();