const range = require('./Range')

const consumption = values => {
  function mostCommonBit(index) {
    const ones = values.filter(v => v[index] === '1').length;
    return ones > (values.length / 2) ? '1' : '0';
  }

  const bitLength = values[0].length;
  const gamma = range(0, bitLength-1)
    .map(n => mostCommonBit(n))
    .join('')

  const epsilon = (parseInt(gamma, 2) ^ parseInt('1'.repeat(bitLength), 2)).toString(2);

  const consumption = parseInt(gamma, 2) * parseInt(epsilon, 2);
  console.log({gamma, epsilon, consumption})

  return {gamma, epsilon, consumption};
};

describe('consuption', () => {
  test('one value', () => {
    expect(consumption(['00100'])).toMatchObject({
      gamma: '00100',
      epsilon: '11011'
    });
  });
  test('two identical values', () => {
    expect(consumption(['00100', '00100'])).toMatchObject({
      gamma: '00100',
      epsilon: '11011'
    });
  });
  test('three different', () => {
    expect(consumption([
      '11100',
      '01110',
      '00111'
    ])).toMatchObject({
      gamma: '01110',
      epsilon: '10001'
    });
  });
  test('aoc example', () => {
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
    ])).toMatchObject({consumption: 198})
  });
  test('my input', () => {
    expect(consumption(require('./day3.input'))).not.toMatchObject({consumption: 58})
    expect(consumption(require('./day3.input'))).not.toMatchObject({consumption: 14619140})
  });
});