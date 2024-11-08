const models = require('../models');

const { Domo } = models;

const snowflakePage = async (req, res) => res.render('app');

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

module.exports = {
  snowflakePage,
  playSnowflake
};
