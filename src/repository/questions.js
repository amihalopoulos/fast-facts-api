const uuid = require('uuid');
const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createQuestion = params => {
  const questionText = params.question;
  const answer = params.answer;
  const episode = params.episode;

  const question = {
    uuid: uuid.v4(),
    question: questionText,
    answer: answer,
    episode: episode,
    timestamp: new Date().getTime()
  };

  const dbInfo = {
    TableName: process.env.QUESTIONS_TABLE,
    Item: question
  };

  return dynamoDb
    .put(dbInfo)
    .promise()
    .then(res => question)
    .then(res => ({ data: res, err: null }))
    .catch(err => ({ data: null, err: err }));
};

module.exports.getEpisodeQuestions = episodeId => {
  const dbInfo = {
    TableName: process.env.QUESTIONS_TABLE,
    IndexName: process.env.QUESTION_EPISODE_INDEX,
    KeyConditionExpression: '#episode = :v_episode',
    ExpressionAttributeNames: {
      '#episode': 'episode'
    },
    ExpressionAttributeValues: {
      ':v_episode': episodeId
    }
  };

  return dynamoDb
    .query(dbInfo)
    .promise()
    .then(res => ({ data: res.Items, err: null }))
    .catch(err => ({ data: null, err: err }));
};

module.exports.getQuestion = (questionId, episodeId) => {
  const dbInfo = {
    TableName: process.env.QUESTIONS_TABLE,
    Key: {
      uuid: questionId,
      episode: episodeId
    }
  };

  return dynamoDb
    .get(dbInfo)
    .promise()
    .then(res => ({ data: res.Item, err: null }))
    .catch(err => ({ data: null, err: err }));
};
