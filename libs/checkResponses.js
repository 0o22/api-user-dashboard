'use strict';

/**
 * Check if the responses are correct
 * @param {Array} questionsWithAnswers - Array of objects with questions and correct answers
 * @param {Array} responses - Array of objects with questions and answers
 * @returns {Boolean} - Returns true if responses are correct, false otherwise
 */
function checkResponses(questionsWithAnswers, responses) {
  return responses.every((response) => {
    const questionWithAnswer = questionsWithAnswers.find(
      (qa) => qa.question === response.question
    );

    return questionWithAnswer.correctAnswer === response.answer;
  });
}

module.exports = { checkResponses };
