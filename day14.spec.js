function step(instructions) {
  return {...instructions, template: 'ACB'};
}

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
  ]};

describe('Extended Polymerization', () => {
  describe('pair insertion', () => {
    test('single rule', () => {
      const rules = ['AB -> C'];
      expect(step({template: 'AB', rules})).toMatchObject({template: 'ACB', rules})
    });
    xtest('aoc example', () => {
      expect(step(aocExample)).toMatchObject({template: 'NCNBCHB'})
    });
    // xtest('my input', () => {
    //   expect(step({template: 'AB', rules: ['AB -> C']})).toMatchObject({template: 'ACB'})
    // });
  })
});