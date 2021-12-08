const _ = require("lodash/fp");
const parseSubLine = line => _.flow(
  _.split(' '),
  _.map(_.trim),
  _.filter(_.negate(_.isEmpty))
)(line);

const parseLine = line => _.flow(
  _.split('|'),
  _.map(parseSubLine),
)(line);

const parseInput = _.flow(
  _.split('\n'),
  _.map(parseLine),
);

const segmentPossibilities = {
  2: [1],
  3: [7],
  4: [4],
  // 5: [2,3,5],
  // 6: [0,6,9],
  7: [8],
}

const convert = line => {
  return line.map(word => word.length)
    .filter(length => segmentPossibilities[length] !== undefined)
    .length
};

const countDigits = input => {
  return _.flow(
    _.tap(console.log),
    _.map(line => line[1]),
    _.tap(console.log),
    _.map(line => convert(line)),
    _.sum,
  )(input)
};

describe('count 1, 4, 7, 8', () => {
  test('simple example', () => {
    const input = parseInput('be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe');
    expect(countDigits(input)).toEqual(2)
  });

  test('aoc example', () => {
    const input = parseInput('' +
      'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe\n' +
      'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc\n' +
      'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg\n' +
      'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb\n' +
      'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea\n' +
      'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb\n' +
      'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe\n' +
      'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef\n' +
      'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb\n' +
      'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce'
    );
    expect(countDigits(input)).toEqual(26)
  });

  // test('my input', () => {
  //   const input = parseInput(require('./day8.input'));
  //   expect(countDigits(input)).toEqual(26)
  // });
});