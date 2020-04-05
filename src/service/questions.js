const QuestionsRepo = require('../repository/questions');
const ScoreRepo = require('../repository/scores');

module.exports.createQuestion = (event, context, callback) => {
  QuestionsRepo.createQuestion(JSON.parse(event.body)).then(result => {
    if (result.error) {
      return callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Unable to submit question`
        })
      });
    }

    return callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Success`,
        data: result.data
      })
    });
  });
};

module.exports.getEpisodeQuestions = (event, context, callback) => {
  const episodeId = event.pathParameters.id;
  QuestionsRepo.getEpisodeQuestions(episodeId).then(result => {
    if (result.error) {
      return callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Unable to find episode questions`
        })
      });
    }

    return callback(null, {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Success`,
        data: result.data
      })
    });
  });
};

module.exports.checkQuestionAnswer = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  const questionId = event.pathParameters.uuid;
  const epiosdeId = body.episodeId;
  const question = await QuestionsRepo.getQuestion(questionId, epiosdeId);

  if (question.error != null) {
    return callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Unable to find question`
      })
    });
  }

  const answerResult = body.answer === question.data.answer;

  const data = {
    questionId: question.data.uuid,
    ipAddress: body.user,
    episodeId: epiosdeId,
    pointValue: answerResult ? question.pointValue || 1 : 0
  };

  const userScore = await ScoreRepo.updateUserScore(data);

  if (userScore.err) {
    return callback(null, {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Unable to update score`
      })
    });
  }

  userScore.data.result = answerResult;

  return callback(null, {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Success`,
      data: userScore.data
    })
  });
};
