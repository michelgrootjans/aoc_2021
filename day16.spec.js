const _ = require('lodash');

const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => parseInt(hex, 16).toString(2);

function parseLiteralValue(groups, accumulator = '') {
  const headLiteral = groups.substr(1, 4);
  if(groups.length === 0) return accumulator;
  if (groups.startsWith('0')) return accumulator + headLiteral;
  return accumulator + headLiteral + parseLiteralValue(groups.substr(5));
}

function toLiteralValue(packet) {
  const bVersion = packet.substr(0, 3);
  const bTypeId = packet.substr(3, 3);
  const bValue = parseLiteralValue(packet.substr(6));

  return {
    version: binToInt(bVersion),
    typeId: binToInt(bTypeId),
    value: binToInt(bValue)
  };
}

describe('Packet Decoder', () => {
  describe('hex to bin', () => {
    test('aoc example 1', () => {
      expect(hexToBin('D2FE28'))
        .toEqual('1101' + '0010' + '1111' + '1110' + '0010' + '1000')
    });
  })
  describe('bin to literal value', () => {
    test('aoc example 1', () => {
      expect(toLiteralValue('110' + '100' + '10111' + '11110' + '00101' + '000'))
        .toEqual({version: 6, typeId: 4, value: 2021})
    });
  })
  describe('sum of version numbers', () => {
    test('simple packet', () => {
      expect(hexToBin('D2FE28'))
        .toEqual('1101' + '0010' + '1111' + '1110' + '0010' + '1000')
    });
  })
});