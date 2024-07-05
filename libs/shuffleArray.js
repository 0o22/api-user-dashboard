'use strict';

/**
 * Shuffle an array and return a new array
 * @param {Array} array - The array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
  return array
    .map((value) => ({ sort: Math.random(), value }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
}

module.exports = { shuffleArray };
