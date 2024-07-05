'use strict';

const questions = require('../constants/questions.json');
const { shuffleArray } = require('./shuffleArray');

/**
 * Get questions with correct answers
 * @returns {Array} - Array of questions with correct answers
 */
function getQuestionsWithAnswers() {
  return shuffleArray(questions.questions);
}

module.exports = { getQuestionsWithAnswers };
