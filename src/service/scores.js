const ScoresRepo = require('../repository/scores');

module.exports.getHighScores = (event, context, callback) => {
  const episodeId = event.pathParameters.id;
  ScoresRepo.getHighScores(episodeId).then(result => {
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
