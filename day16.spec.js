const _ = require('lodash');

const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => parseInt(hex, 16).toString(2);

const parseLiteralValue = ({packet = '', value = '', rest}) => {
  if (rest.length < 5) throw `could not parse [${groups}]`

  const newResult = {
    value: value + rest.substr(1, 4),
    packet: packet + rest.substr(0, 5),
    rest: rest.substr(5)
  };

  if (rest.substr(0, 5).startsWith('0')) return newResult;
  return parseLiteralValue(newResult);
};

const versionAndType = packet => ({
  bVersion: packet.substr(0, 3),
  bTypeId: packet.substr(3, 3),
});

const binToLiteralValue = packet => {
  const {bVersion, bTypeId} = versionAndType(packet);
  const parsedValue = parseLiteralValue({rest: packet.substr(6)});

  return {
    version: binToInt(bVersion),
    typeId: binToInt(bTypeId),
    value: binToInt(parsedValue.value),
    packet: bVersion + bTypeId + parsedValue.packet,
    rest: parsedValue.rest,
  };
};

const hexToLiteralValue = hex => binToLiteralValue(hexToBin(hex));

function binToOperator(packet) {
  const {bVersion, bTypeId} = versionAndType(packet);
  const lengthTypeId = binToInt(packet.substr(6, 1))
  const lengthType = lengthTypeId === 0 ? 15 : 11;
  const length = binToInt(packet.substr(7, lengthType));

  const subPackets = []
  let command = {rest: packet.substr(7 + lengthType, length)}
  while (command.rest.length > 5) {
    command = binToLiteralValue(command.rest);
    subPackets.push(command);
  }

  return {
    version: binToInt(bVersion), typeId: binToInt(bTypeId), lengthTypeId, length,
    subPackets
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
        .toMatchObject({
          version: 6,
          typeId: 4,
          value: 2021,
          packet: '110' + '100' + '10111' + '11110' + '00101',
          rest: '000'
        })
    });
    test('hex to literal', () => {
      expect(hexToLiteralValue('D2FE28'))
        .toMatchObject({
          version: 6,
          typeId: 4,
          value: 2021,
          packet: '110' + '100' + '10111' + '11110' + '00101',
          rest: '000'
        })
    });
  })
  describe('operator', () => {
    test('bin to operator', () => {
      expect(binToOperator('001' + '110' + '0' + '000000000011011' + '11010001010' + '0101001000100100' + '0000000'))
        .toMatchObject({
          version: 1, typeId: 6, lengthTypeId: 0, length: 27,
          subPackets: [
            {version: 6, typeId: 4, value: 10, packet: '11010001010'},
            {version: 2, typeId: 4, value: 20, packet: '0101001000100100'},
          ]
        })
    });
  })
});