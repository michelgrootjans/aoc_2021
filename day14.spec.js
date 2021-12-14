const _ = require('lodash');

const Rule = description => {
  const [from, to] = description.split(' -> ');
  return {
    from,
    react: pair => pair[0] + to,
    description
  }
};

function Rules(ruleDescriptions) {
  const rules = ruleDescriptions.map(Rule)
  return {
    rules: ruleDescriptions,
    react: pair => {
      const rule = rules.find(rule => rule.from === pair);
      if(!rule) return pair;
      return rule.react(pair);
    }
  };
}

const step = instructions => {
  const rules = Rules(instructions.rules);
  const template = instructions.template;
  const pairs = _(template)
    .reduce((acc) => {
      return {
        template: _.drop(acc.template, 1),
        pairs: [...acc.pairs, _.take(acc.template, 2)]
      }
    }, {template, pairs: []})
    .pairs
    .map(pair => pair.join(''));

  const newTemplate = pairs.map(pair => rules.react(pair)).join('')

  // console.log({template, pairs, newTemplate, rules: rules.rules})

  return {template: newTemplate, rules: instructions.rules};
};

const aocExample = {
  template: 'NNCB',
  rules: [
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
  ]
};

function steps(instructions, numberOfSteps) {
  const result = _.times(numberOfSteps)
    .reduce((acc) => step(acc), instructions)
  return result;
}

function subtractMaxMin(word) {
  const wordCount = _(word)
    .groupBy()
    .map((value, key) => ({key, length: value.length}));
  const max = wordCount.maxBy(_ => _.length);
  const min = wordCount.minBy(_ => _.length);
  let result = max
    .key;

  // console.log({min, max, result});
  return {max: {[max.key]: max.length}, min: {[min.key]: min.length}, diff: max.length - min.length};
}

function maxMin(instructions, number) {
  return subtractMaxMin(steps(instructions, number).template).diff;
}

describe('Extended Polymerization', () => {
  describe('pair insertion', () => {
    test('single rule', () => {
      const rules = ['AC -> B'];
      expect(step({template: 'AC', rules})).toMatchObject({template: 'ABC'})
    });
    test('two rules', () => {
      const rules = ['AC -> B', 'CE -> D'];
      expect(step({template: 'ACE', rules})).toMatchObject({template: 'ABCDE'})
    });
    describe('aoc example', () => {
      test('step 1', () => expect(steps(aocExample, 1)).toMatchObject({template: 'NCNBCHB'}));
      test('step 2', () => expect(steps(aocExample, 2)).toMatchObject({template: 'NBCCNBBBCBHCB'}));
      test('step 3', () => expect(steps(aocExample, 3)).toMatchObject({template: 'NBBBCNCCNBBNBNBBCHBHHBCHB'}));
      test('step 3', () => expect(steps(aocExample, 4)).toMatchObject({template: 'NBBNBNBBCCNBCNCCNBBNBBNBBBNBBNBBCBHCBHHNHCBBCBHCB'}));
      test('step 10', () => expect(maxMin(aocExample, 10)).toEqual(1749 - 161));
    });
    describe('count letters', () => {
      test('AAAAABCCC => A:5, B:1', () => expect(subtractMaxMin('AAAAABCCC')).toMatchObject({max: {'A': 5}, min: {'B': 1}, diff: 4}))
    });
    test('my input', () => {
      expect(maxMin(require('./day14.input'), 10)).toEqual(2027)
    });
  })
});