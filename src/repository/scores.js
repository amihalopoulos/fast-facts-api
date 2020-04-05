const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getHighScores = episodeId => {
  const dbInfo = {
    TableName: process.env.SCORES_TABLE,
    IndexName: process.env.SCORES_EPISODE_INDEX,
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
    .then(res => {
      return { data: res.Items, err: null };
    })
    .catch(err => ({ data: null, err: err }));
};

module.exports.updateUserScore = data => {
  console.log(data);
  const dbInfo = {
    TableName: process.env.SCORES_TABLE,
    Key: {
      ipAddress: data.ipAddress,
      episode: data.episodeId
    },
    ExpressionAttributeNames: {
      '#answers': 'answers'
    },
    ConditionExpression: `NOT contains(#answers, :v_question)`,
    UpdateExpression:
      'ADD score :v_pointValue  SET answers = list_append(answers, :v_questionList)',
    ExpressionAttributeValues: {
      ':v_question': data.questionId,
      ':v_questionList': [data.questionId],
      ':v_pointValue': data.pointValue
    },
    ReturnValues: 'ALL_NEW'
  };

  return dynamoDb
    .update(dbInfo)
    .promise()
    .then(res => {
      console.log(res);
      return { data: res, err: null };
    })
    .catch(err => ({ data: null, err: err }));
};
