const EpisodesRepo = require('../repository/episodes');

module.exports.createEpisode = (event, context, callback) => {
  EpisodesRepo.createEpisode(JSON.parse(event.body)).then(result => {
    if (result.error) {
      return callback(null, {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Unable to submit episode`
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
