const _ = require('lodash')

const openingCharacters = ['(', '[', '{', '<']
const pairs = {'(': ')', '[': ']', '{': '}', '<': '>'}
const corruptScores = {')': 3, ']': 57, '}': 1197, '>': 25137}
const incompleteScores = {')': 1, ']': 2, '}': 3, '>': 4}

const opensChunk = character => openingCharacters.includes(character);
const closingCharacter = openingCharacter => pairs[openingCharacter];
const isPair = (left, right) => closingCharacter(left) === right;

const corruptScoreOf = c => corruptScores[c];
const incompleteScore = c => incompleteScores[c];

const incompleteScoreOf = characterStack => _(characterStack)
  .reverse()
  .map(closingCharacter)
  .map(incompleteScore)
  .reduce((total, number) => (total * 5) + number, 0);

const checkLine = line => {
  const characterStack = []

  for (let i = 0; i < line.length; i++) {
    const currentCharacter = line[i]
    if (opensChunk(currentCharacter)) {
      characterStack.push(currentCharacter);
    } else {
      const openingCharacter = _.last(characterStack);
      if (isPair(openingCharacter, currentCharacter)) {
        characterStack.pop();
      } else {
        return {state: 'corrupted', score: corruptScoreOf(currentCharacter)}
      }
    }
  }
  if (characterStack.length > 0) {
    return {state: 'incomplete', score: incompleteScoreOf(characterStack)};
  }
  return {state: 'valid'};
};

const scoreCorruptedLines = lines => {
  return _(lines)
    .map(checkLine)
    .filter(result => result.state === 'corrupted')
    .map(result => result.score)
    .sum();
};

const scoreIncompleteLines = lines => {
  const scores = _(lines)
    .map(checkLine)
    .filter(result => result.state === 'incomplete')
    .map(result => result.score)
    .sortBy(number => number)
    .value();

  const middleIndex = (scores.length - 1) / 2;

  return scores[middleIndex];
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
      expect(scoreCorruptedLines(aocExample)).toEqual(26397);
    });
    test('aoc example', () => {
      const lines = require('./day10.input');
      expect(scoreCorruptedLines(lines)).toEqual(167379);
    });
  });
  describe('incomplete lines', () => {
    test('aoc example', () => {
      expect(scoreIncompleteLines(aocExample)).toEqual(288957);
    });
    test('aoc example', () => {
      const lines = require('./day10.input');
      expect(scoreIncompleteLines(lines)).toEqual(2776842859);
    });
  });
});