const _ = require("lodash/fp");

const parseInput = input => {
  const normalize = value => value.trim().split('').sort().join('');

  const parseSubLine = line => _.flow(
    _.split(' '),
    _.map(normalize),
  )(line);

  const parseLine = line => _.flow(
    _.split(' | '),
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

const minus = (whole, part) => {
  const wholes = whole.split('');
  const parts = part.split('');

  return wholes.filter(letter => !parts.includes(letter)).join('')
};

const crack = line => {
  const code = line[0];

  const one = code.find(digit => digit.length === 2)
  const four = code.find(digit => digit.length === 4)
  const seven = code.find(digit => digit.length === 3)
  const eight = code.find(digit => digit.length === 7)

  const two = code.find(digit => digit.length === 5 && minus(digit, four).length === 3)
  const three = code.find(digit => digit.length === 5 && minus(digit, one).length === 3)
  const five = code.find(digit => digit.length === 5 && ![two, three].includes(digit))

  const six = code.find(digit => digit.length === 6 && minus(digit, one).length === 5)
  const nine = code.find(digit => digit.length === 6 && minus(digit, four).length === 2)
  const zero = code.find(digit => digit.length === 6 && ![six, nine].includes(digit))
  
  return {
    [zero]: 0,
    [one]: 1,
    [two]: 2,
    [three]: 3,
    [four]: 4,
    [five]: 5,
    [six]: 6,
    [seven]: 7,
    [eight]: 8,
    [nine]: 9
  };
};

const solve = input => {
  return _.flow(
    _.map(line => ({ dictionary: crack(line), output: line[1]})),
    _.map(tuple => tuple.output.map(word => tuple.dictionary[word])),
    _.map(numbers => parseInt(numbers.join(''))),
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