const _ = require('lodash')

const openingCharacters = ['(', '[', '{', '<']
const pairs = ['()', '[]', '{}', '<>']
const matches = {'(': ')', '[': ']', '{': '}', '<': '>'}
const scores = {')': 3, ']': 57, '}': 1197, '>': 25137}

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
        return {state: 'corrupted', score: scores[character]}
      }
    }
  }
  return {state: 'valid', score: 0};
};

const checkSyntax = lines => {
  const score = _(lines)
    .map(checkLine)
    .map(result => result.score)
    .sum();
  return {score}
};

describe('Syntax Scoring', () => {
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

  test('aoc example', () => {
    const lines = [
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
    expect(checkSyntax(lines)).toMatchObject({score: 26397});
  });
  test('aoc example', () => {
    const lines = require('./day10.input');
    expect(checkSyntax(lines)).toMatchObject({score: 167379});
  });


});