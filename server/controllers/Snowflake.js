const models = require('../models');

const { Domo: Snowflake } = models;

const snowflakePage = async (req, res) => res.render('snowflake');

const makeSnowflake = async (req, res) => {
  if (!req.body.word) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  const snowflakeData = {
    word: req.body.word,
    owner: req.session.account._id,
  };

  try {
    const newSnowflake = new Snowflake(snowflakeData);
    await newSnowflake.save();

    return res.status(201).json({
      word: newSnowflake.word
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Snowflake already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making snowflake!' });
  }
};

const playSnowflake = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Snowflake.find(query).select('name age element publicity').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

const getMatchingSnowflakes = async (req, res) => {
  try {
    const query = { publicity: 'true' };
    const docs = await Snowflake.find(query).select('name age element publicity').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  snowflakePage,
  makeSnowflake,
  playSnowflake,
  getMatchingSnowflakes
};
