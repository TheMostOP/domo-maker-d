const mongoose = require('mongoose');
const _ = require('underscore');

const setWord = (word) => _.escape(word).trim();

const SnowflakeSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    trim: true,
    set: setWord,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

SnowflakeSchema.statics.toAPI = (doc) => ({
  word: doc.word,
});

const SnowflakeModel = mongoose.model('Snowflake', SnowflakeSchema);
module.exports = SnowflakeModel;
