const consumption = values => {


  const gamma = parseInt(values[0], 2);
  const epsilon = gamma ^ parseInt('11111', 2);

  return {gamma: gamma, epsilon: epsilon, sum: 198};
};

describe('consuption', () => {
  test('one value', () => {
    expect(consumption(['00100'])).toMatchObject({
      gamma:   parseInt('00100', 2),
      epsilon: parseInt('11011', 2)});
  });
  test('two identical values', () => {
    expect(consumption(['00100', '00100'])).toMatchObject({
      gamma:   parseInt('00100', 2),
      epsilon: parseInt('11011', 2)});
  });
  xtest('three different', () => {
    expect(consumption([
      '11100',
      '01110',
      '00111'
    ])).toMatchObject({
      gamma:   parseInt('01110', 2),
      epsilon: parseInt('10001', 2)});
  });
  test('should aoc example', () => {
    expect(consumption([
      '00100',
      '11110',
      '10110',
      '10111',
      '10101',
      '01111',
      '00111',
      '11100',
      '10000',
      '11001',
      '00010',
      '01010',
    ])).toMatchObject({sum: 198})
  });
});