const _ = require('lodash');

const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => parseInt(hex, 16).toString(2);

const parseLiteralValue = (groups, accumulator = '') => {
  const headLiteral = groups.substr(1, 4);
  if (groups.length === 0) return accumulator;
  if (groups.startsWith('0')) return accumulator + headLiteral;
  return accumulator + headLiteral + parseLiteralValue(groups.substr(5));
};

const versionAndType = packet => {
  const bVersion = packet.substr(0, 3);
  const bTypeId = packet.substr(3, 3);

  return {
    version: binToInt(bVersion),
    typeId: binToInt(bTypeId),
  }
};

const binToLiteralValue = packet => {
  const {version, typeId} = versionAndType(packet);
  const bValue = parseLiteralValue(packet.substr(6));

  return {
    version,
    typeId,
    value: binToInt(bValue),
    packet
  };
};

const hexToLiteralValue = hex => binToLiteralValue(hexToBin(hex));

function binToOperator(packet) {
  const {version, typeId} = versionAndType(packet);
  const lengthTypeId = binToInt(packet.substr(6, 1))
  const length = binToInt(packet.substr(7, lengthTypeId === 0 ? 15 : 11))

  return {
    version, typeId, lengthTypeId, length,
    subPackets: [
      {version: 6, typeId: 4, value: 10},
      {version: 2, typeId: 4, value: 20},
    ]
  };
}

describe('Packet Decoder', () => {
  describe('hex to bin', () => {
    test('aoc example 1', () => {
      expect(hexToBin('D2FE28'))
        .toEqual('1101' + '0010' + '1111' + '1110' + '0010' + '1000')
    });
  })
  describe('literal value', () => {
    test('bin to literal', () => {
      expect(binToLiteralValue('110' + '100' + '10111' + '11110' + '00101' + '000'))
        .toEqual({version: 6, typeId: 4, value: 2021, packet: '110' + '100' + '10111' + '11110' + '00101' + '000'})
    });
    test('hex to literal', () => {
      expect(hexToLiteralValue('D2FE28'))
        .toEqual({version: 6, typeId: 4, value: 2021, packet: '110' + '100' + '10111' + '11110' + '00101' + '000'})
    });
  })
  describe('operator', () => {
    test('bin to operator', () => {
      expect(binToOperator('001' + '110' + '0' + '000000000011011' + '11010001010' + '0101001000100100' + '0000000'))
        .toMatchObject({
          version: 1, typeId: 6, lengthTypeId: 0, length: 27,
          subPackets: [
            {},
            {},
            // {version: 6, typeId: 4, value: 10},
            // {version: 2, typeId: 4, value: 20},
          ]
        })
    });
  })
});