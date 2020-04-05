const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createEpisode = params => {
  const title = params.title;
  const description = params.description;

  const episode = {
    uuid: uuid.v4(),
    title: title,
    description: description,
    timestamp: new Date().getTime()
  };

  const dbInfo = {
    TableName: process.env.EPISODES_TABLE,
    Item: episode
  };

  return dynamoDb
    .put(dbInfo)
    .promise()
    .then(res => episode)
    .then(res => ({ data: res, err: null }))
    .catch(err => ({ data: null, err: err }));
};
