const models = require('../models');

const { Domo } = models;

const snowflakePage = async (req, res) => res.render('snowflake');

const playSnowflake = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age element publicity').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

//TODO: add getMatchingSnowflakes method

module.exports = {
  snowflakePage,
  playSnowflake
};
