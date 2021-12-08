const _ = require("lodash/fp");

const parseInput = input => {
  const parseSubLine = line => _.flow(
    _.split(' '),
    _.map(_.trim),
    _.filter(_.negate(_.isEmpty))
  )(line);

  const parseLine = line => _.flow(
    _.split('|'),
    _.map(parseSubLine),
  )(line);

  return _.flow(
    _.split('\n'),
    _.map(parseLine),
  )(input);
};

const countSimpleDigits = input => {
  return _.flow(
    _.map(line => line[1]),
    _.map(line =>
      line.map(word => word.length)
        .filter(length => [2, 3, 4, 7].includes(length))
        .length),
    _.sum,
  )(input)
};

const aocExample = '' +
  'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe\n' +
  'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc\n' +
  'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg\n' +
  'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb\n' +
  'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea\n' +
  'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb\n' +
  'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe\n' +
  'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef\n' +
  'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb\n' +
  'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce';

describe('count 1, 4, 7, 8', () => {
  test('simple example', () => {
    const input = parseInput('be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe');
    expect(countSimpleDigits(input)).toEqual(2)
  });

  test('aoc example', () => {
    const input = parseInput(aocExample);
    expect(countSimpleDigits(input)).toEqual(26)
  });

  test('my input', () => {
    const input = parseInput(require('./day8.input'));
    expect(countSimpleDigits(input)).toEqual(362)
  });
});

const contains = (whole, part) => part.split('')
  .every(letter => whole.indexOf(letter) !== -1);

const minus = (whole, part) => {
  const wholes = whole.split('');
  const parts = part.split('');

  return wholes.filter(letter => !parts.includes(letter)).join('')
};

const crack = line => {
  const code = line[0];
  const one = code.find(word => word.length === 2)
  const four = code.find(word => word.length === 4)
  const seven = code.find(word => word.length === 3)
  const eight = code.find(word => word.length === 7)

  const two = code.find(word => word.length === 5 && minus(word, four).length === 3)
  const three = code.find(word => word.length === 5 && contains(word, one))
  const five = code.find(word => word.length === 5 && ![two, three].includes(word))

  const six = code.find(word => word.length === 6 && minus(word, one).length === 5)
  const nine = code.find(word => word.length === 6 && contains(word, four))
  const zero = code.find(word => word.length === 6 && ![six, nine].includes(word))

  const solution = {}
  solution[zero.split('').sort().join('')] = 0
  solution[one.split('').sort().join('')] = 1
  solution[two.split('').sort().join('')] = 2
  solution[three.split('').sort().join('')] = 3
  solution[four.split('').sort().join('')] = 4
  solution[five.split('').sort().join('')] = 5
  solution[six.split('').sort().join('')] = 6
  solution[seven.split('').sort().join('')] = 7
  solution[eight.split('').sort().join('')] = 8
  solution[nine.split('').sort().join('')] = 9

  return solution;
};

const findDigit = (word, dictionary) => {
  const sortedWord = word.split('').sort().join('');
  return dictionary[sortedWord];
};

const solve = input => {
  return _.flow(
    _.map(line => ({line, dictionary: crack(line)})),
    _.map(tuple => tuple.line[1].map(word => findDigit(word, tuple.dictionary))),
    // _.tap(console.log),
    _.map(numbers => numbers[0] * 1000 + numbers[1] * 100 + numbers[2] * 10 + numbers[3]),
    _.sum,
  )(input)
};

describe('break code', () => {
  test('simple example', function () {
    const input = parseInput('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf');
    expect(crack(input[0])).toEqual({
      abcdeg: 0,
      ab: 1,
      acdfg: 2,
      abcdf: 3,
      abef: 4,
      bcdef: 5,
      bcdefg: 6,
      abd: 7,
      abcdefg: 8,
      abcdef: 9,
    });
    expect(solve(input)).toEqual(5353)
  });
  test('aoc example', function () {
    const input = parseInput(aocExample);
    expect(solve(input)).toEqual(61229)
  });
  test('my input', function () {
    const input = parseInput(require('./day8.input'));
    expect(solve(input)).toEqual(1020159)
  });
});