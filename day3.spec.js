const range = require('./Range')

function inverse(bitAsString) {
  if(bitAsString === '0') return '1';
  return '0'
}

const consumption = values => {
  function mostCommonBit(index) {
    const ones = values.filter(v => v[index] === '0').length;
    return ones > (values.length / 2) ? '0' : '1';
  }

  const bitLength = values[0].length;
  const gamma = range(0, bitLength-1)
    .map(n => mostCommonBit(n))
    .join('')

  const epsilon = (parseInt(gamma, 2) ^ parseInt('1'.repeat(bitLength), 2)).toString(2);
  const consumption = parseInt(gamma, 2) * parseInt(epsilon, 2);

  const mostCommonBit1 = mostCommonBit(0);
  const leastCommonBit1 = inverse(mostCommonBit1);
  let o2 = '0';

  let bleh = [...values]
  console.log({bleh})
  for (let i = 0; i < bitLength; i++) {
    const referenceValue = mostCommonBit(i);
    bleh = bleh.filter(x => x[i] === referenceValue);
    console.log({referenceValue, bleh})
    if(bleh.length === 1) {
      o2 = bleh[0]
      break
    }

  }

  const co2 = values.find(x => x[0] === leastCommonBit1) || '0';

  const rating = parseInt(o2, 2) * parseInt(co2, 2);

  console.log({values, gamma, epsilon, consumption, o2, co2, rating})

  return {gamma, epsilon, consumption, o2, co2, rating};
};

describe('consuption', () => {
  test('one value', () => {
    expect(consumption(['00100'])).toMatchObject({
      gamma: '00100',
      epsilon: '11011',
      consumption: 0b00100 * 0b11011,
      o2:  '00100',
      co2: '0',
      rating: 0b00100 * 0,
    });
  });
  test('two different values', () => {
    expect(consumption([
      '1010',
      '0011'
    ])).toMatchObject({
      gamma:   '1011',
      epsilon:   '100',
      consumption: 0b1011 * 0b0100,
      o2:  '1010',
      co2: '0011',
      rating: 0b1010 * 0b0011,
    });
  });
  test('three different', () => {
    expect(consumption([
      '11100',
      '00111',
      '01110',
    ])).toMatchObject({
      gamma: '01110',
      epsilon: '10001',
      consumption: 0b01110 * 0b10001,
      o2:  '01110',
      co2: '11100',
      rating: 0b01110 * 0b11100,
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
    ])).toMatchObject({
      gamma: '10110',
      epsilon: '1001',
      consumption: 198,
    })
  });
  xtest('my input', () => {
    expect(consumption(require('./day3.input'))).not.toMatchObject({consumption: 58})
    expect(consumption(require('./day3.input'))).not.toMatchObject({consumption: 14619140})
  });
});