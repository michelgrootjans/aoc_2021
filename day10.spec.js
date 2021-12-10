const _ = require('lodash')
const lines = require("./day10.input");

const openingCharacters = ['(', '[', '{', '<']
const pairs = ['()', '[]', '{}', '<>']
const matches = {'(': ')', '[': ']', '{': '}', '<': '>'}
const corruptScores = {')': 3, ']': 57, '}': 1197, '>': 25137}
const incompleteScores = {')': 1, ']': 2, '}': 3, '>': 4}

const checkLine = line => {
  const characterStack = []

  for (let i = 0; i < line.length; i++) {
    const character = line[i]
    if (openingCharacters.includes(character)) {
      characterStack.push(character);
    } else {
      const pair = _.last(characterStack) + character;
      if (pairs.includes(pair)) {
        characterStack.pop();
      } else {
        return {state: 'corrupted', score: corruptScores[character]}
      }
    }
  }
  if (characterStack.length > 0) {
    const score = _(characterStack)
      .reverse()
      .map(character => matches[character])
      .map(closingCharacter => incompleteScores[closingCharacter])
      .reduce((total, number) => (total * 5) + number, 0)
    ;

    return {state: 'incomplete', score};
  }
  return {state: 'valid'};
};

const scoreCorruptedLines = lines => {
  const score = _(lines)
    .map(checkLine)
    .filter(result => result.state === 'corrupted')
    .map(result => result.score)
    .sum();
  return {score}
};

const scoreIncompleteLines = lines => {
  const scores = _(lines)
    .map(checkLine)
    .filter(result => result.state === 'incomplete')
    .map(result => result.score)
    .sortBy(number => number)
    .value();

  const middleIndex = (scores.length - 1) / 2;

  return {score: scores[middleIndex]}
};

describe('Syntax Scoring', () => {
  const aocExample = [
    '[({(<(())[]>[[{[]{<()<>>',
    '[(()[<>])]({[<{<<[]>>(',
    '{([(<{}[<>[]}>{[]{[(<()>',
    '(((({<>}<{<{<>}{[]{[]{}',
    '[[<[([]))<([[{}[[()]]]',
    '[{[{({}]{}}([{[{{{}}([]',
    '{<[[]]>}<{[{[{[]{()[[[]',
    '[<(<(<(<{}))><([]([]()',
    '<{([([[(<>()){}]>(<<{{',
    '<{([{{}}[<[[[<>{}]]]>[]]'
  ];
  describe('single lines', () => {
    test.each([
      ['()'], ['[]'], ['{}'], ['<>'], ['<>'],
      ['(())'], ['([])'], ['({})'], ['(<>)'],
    ])('%p is valid', (line) => {
      expect(checkLine(line)).toMatchObject({state: 'valid'});
    });
    test.each([
      ['[)', 3],
      ['(]', 57],
      ['(}', 1197],
      ['(>', 25137],
      ['{()()()>', 25137],
      ['(((()))}', 1197],
      ['<([]){()}[{}])', 3],
    ])('%p is corrupted - score = %d', (line, score) => {
      expect(checkLine(line)).toMatchObject({state: 'corrupted', score});
    });
    test.each([
      ['(', 1], ['[', 2], ['{', 3], ['<', 4],
      ['((', 5 + 1],
      ['([', 1 + (2 * 5)],
      ['<{([', 4 + 3 * 5 + 1 * 5 * 5 + 2 * 5 * 5 * 5],
    ])('%p is incomplete - score = %d', (line, score) => {
      expect(checkLine(line)).toMatchObject({state: 'incomplete', score});
    });
  });
  describe('corrupt lines', () => {
    test('aoc example', () => {
      expect(scoreCorruptedLines(aocExample)).toMatchObject({score: 26397});
    });
    test('aoc example', () => {
      const lines = require('./day10.input');
      expect(scoreCorruptedLines(lines)).toMatchObject({score: 167379});
    });
  });
  describe('incomplete lines', () => {
    test('aoc example', () => {
      expect(scoreIncompleteLines(aocExample)).toMatchObject({score: 288957});
    });
    test('aoc example', () => {
      const lines = require('./day10.input');
      expect(scoreIncompleteLines(lines)).toMatchObject({score: 2776842859});
    });
  });
});