const range = require('./Range')

function inverse(bitAsString) {
  if(bitAsString === '0') return '1';
  return '0'
}

function mostCommonBit(index, values) {
  const zeroes = values.filter(v => v[index] === '0').length;
  return zeroes > (values.length / 2) ? '0' : '1';
}
function mostCommonBit2(index, values) {
  const ones = values.filter(v => v[index] === '1').length;
  return ones > (values.length / 2) ? '1' : '0';
}

const consumption = values => {

  const bitLength = values[0].length;
  const gamma = range(0, bitLength-1)
    .map(n => mostCommonBit(n, values))
    .join('')

  const epsilon = (parseInt(gamma, 2) ^ parseInt('1'.repeat(bitLength), 2)).toString(2);
  const consumption = parseInt(gamma, 2) * parseInt(epsilon, 2);

  let o2 = '0';
  let oxygenValues = [...values]
  for (let i = 0; i < bitLength; i++) {
    const referenceValue = mostCommonBit(i, oxygenValues);
    oxygenValues = oxygenValues.filter(x => x[i] === referenceValue);
    if(oxygenValues.length === 1) {
      o2 = oxygenValues[0]
      break
    }
  }

  let co2 = '0';
  let co2Values = [...values]
  for (let i = 0; i < bitLength; i++) {
    const referenceValue = inverse(mostCommonBit(i, co2Values));
    co2Values = co2Values.filter(x => x[i] === referenceValue);
    if(co2Values.length === 1) {
      co2 = co2Values[0]
      break
    }
  }


  const rating = parseInt(o2, 2) * parseInt(co2, 2);

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
      o2: '10111',
      co2: '01010',
      rating: 230,
    })
  });
  test('my input', () => {
    expect(consumption(require('./day3.input'))).toMatchObject({
      consumption: 1025636,
      rating: 793873
    })
  });
});