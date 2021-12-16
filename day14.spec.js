const _ = require('lodash')
const input = require("./day14.input");

function Rules(ruleDescriptions) {
  function Rule(from, to) {
    return {
      left: from[0] + to,
      right: to + from[1],
    };
  }

  return ruleDescriptions
    .map(description => description.split(' -> '))
    .reduce((acc, [from, to]) => {
      acc[from] = new Rule(from, to);
      return acc;
    }, {});
}

function Pairs(template = '') {
  const pairs = new Map();
  const increment = (key, amount = 1) => pairs.set(key, (pairs.get(key) || 0) + amount);

  for (let index = 0; index < template.length - 1; index++) {
    increment(template[index] + template[index + 1]);
  }

  return {
    [Symbol.iterator]: () => pairs.entries(),
    increment
  };
}

function Counter() {
  const items = {};
  const increment = (key, amount = 1) => items[key] = (items[key] || 0) + amount;

  const stats = () => {
    const entries = Object.entries(items)
      .sort((left, right) => left[1] - right[1])
    const min = _.first(entries)[1];
    const max = _.last(entries)[1]
    return {min, max};
  };

  return {
    increment,
    stats
  };
}

function polymer({template, rules}, steps) {
  let pairs = new Pairs(template);

  for (let step = 1; step <= steps; step++) {
    let new_pairs = new Pairs();

    for (let [pair, count] of pairs) {
      const rule = rules[pair];
      new_pairs.increment(rule.left, count);
      new_pairs.increment(rule.right, count);
    }

    pairs = new_pairs;
  }

  const counter = new Counter();
  for (let [[left, right], count] of pairs) {
    counter.increment(left, count);
    counter.increment(right, count);
  }

  /**
   * When we split 'ABC" into two pairs, 'AB' and 'BC', we double count that middle 'B'. However, we _don't_
   * double count the starting 'A' and ending 'C'. So add 1 to whatever the first and last letter of our original
   * input was so that all values are double counted. We use the original input because those never change
   * place. The polymer can only grow in the middle, never on the ends.
   */
  counter.increment(template[0]);
  counter.increment(template[template.length - 1]);

  /**
   * Finally, divide all element counts by 2 since we counted them twice within the pairs, and sort the list.
   */
  const stats = counter.stats()
  const min = stats.min / 2;
  const max = stats.max / 2;

  return {
    min,
    max,
    diff: max - min
  }
}

function parseRules(ruleDescriptions) {
  return Rules(ruleDescriptions);
}

const aocExample = {
  template: 'NNCB',
  rules: parseRules([
      'CH -> B',
      'HH -> N',
      'CB -> H',
      'NH -> C',
      'HB -> C',
      'HC -> B',
      'HN -> C',
      'NN -> C',
      'BH -> H',
      'NC -> B',
      'NB -> B',
      'BN -> B',
      'BB -> N',
      'BC -> B',
      'CC -> N',
      'CN -> C'
    ],
  )
}

describe('Extended Polymerization', () => {
  describe('aoc example', () => {
    test('step 10', () => expect(polymer(aocExample, 10)).toMatchObject({diff: 1749 - 161}));
    test('step 40', () => expect(polymer(aocExample, 40)).toMatchObject({diff: 2188189693529}));
  });
  describe('my input', () => {
    const input = require('./day14.input');
    input.rules = parseRules(input.rules)
    test('step 10', () => expect(polymer(input, 10)).toMatchObject({diff: 2027}));
    test('step 40', () => expect(polymer(input, 40)).toMatchObject({diff: 2265039461737}));
  });
});