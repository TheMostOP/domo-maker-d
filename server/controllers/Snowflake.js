const models = require('../models');

const { Snowflake } = models;

const snowflakePage = async (req, res) => res.render('snowflake');

const getMatchingSnowflakes = async (word) => {
  try {
    const query = { word }; // Match by word
    const docs = await Snowflake.find(query).select('word').lean().exec();
    return docs;
  } catch (err) {
    console.log(err);
    throw new Error('Error retrieving matching snowflakes!');
  }
};

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

    // Check for matching snowflakes
    const matches = await getMatchingSnowflakes(newSnowflake.word);

    return res.status(201).json({
      word: newSnowflake.word,
      matches, // Include matches in the response
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Snowflake already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making snowflake!' });
  }
};

const getSnowflakes = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Snowflake.find(query).select('word owner').lean().exec();

    return res.json({ snowflakes: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving snowflakes!' });
  }
};

module.exports = {
  snowflakePage,
  getMatchingSnowflakes,
  makeSnowflake,
  getSnowflakes,
};
