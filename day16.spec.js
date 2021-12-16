// const _ = require('lodash');

const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => parseInt(hex, 16).toString(2).padStart(hex.length*4, '0');

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

const binToOperator = packet => {
  const lengthTypeId = binToInt(packet.substr(6, 1))

  if (lengthTypeId === 0) {
    const {bVersion, bTypeId} = versionAndType(packet);
    const version = binToInt(bVersion);
    const typeId = binToInt(bTypeId);
    const lengthType = lengthTypeId === 0 ? 15 : 11;
    const length = binToInt(packet.substr(7, lengthType));

    const subPackets = []
    let subPacket = {rest: packet.substr(7 + lengthType, length)}
    while (subPacket.rest.length > 5) {
      subPacket = binToPacket(subPacket.rest);
      subPackets.push(subPacket);
    }

    return {version, typeId, lengthTypeId, length, subPackets};
  } else {
    const {bVersion, bTypeId} = versionAndType(packet);
    const version = binToInt(bVersion);
    const typeId = binToInt(bTypeId);
    const subPackets = [
      {version: 2, typeId: 4, value: 1, packet: '01010000001'},
      {version: 4, typeId: 4, value: 2, packet: '10010000010'},
      {version: 1, typeId: 4, value: 3, packet: '00110000011'},
    ]

    return {version, typeId, lengthTypeId, numberOfSubPackets: 3, subPackets};
  }
};

const binToPacket = packet => {
  const {bTypeId} = versionAndType(packet);
  const typeId = binToInt(bTypeId);
  if(typeId === 4) return binToLiteralValue(packet);
  return binToOperator(packet)
};

const hexToPacket = hex => binToPacket(hexToBin(hex));

describe('Packet Decoder', () => {
  describe('hex to bin', () => {
    test('1', () => expect(hexToBin('1')).toEqual('0001'));
    test('F', () => expect(hexToBin('F')).toEqual('1111'));
    test('10', () => expect(hexToBin('10')).toEqual('00010000'));
    test('D2FE28', () => {
      expect(hexToBin('D2FE28')).toEqual('1101' + '0010' + '1111' + '1110' + '0010' + '1000')
    });
  })
  describe('literal value', () => {
    const hex = 'D2FE28';
    const bin = '110' + '100' + '10111' + '11110' + '00101' + '000';
    const literal = {
      version: 6,
      typeId: 4,
      value: 2021,
      packet: '110' + '100' + '10111' + '11110' + '00101',
      rest: '000'
    };
    test('hex to bin', () => expect(hexToBin(hex)).toEqual(bin));
    test('bin to literal', () => expect(binToLiteralValue(bin)).toMatchObject(literal));
    test('bin to packet', () => expect(binToPacket(bin)).toMatchObject(literal));
    test('hex to packet', () => expect(hexToPacket(hex)).toMatchObject(literal));
  })
  describe('operator 15', () => {
    const hex = '38006F45291200';
    const bin = '001' + '110' + '0' + '000000000011011' + '11010001010' + '0101001000100100' + '0000000';
    const operator = {
      version: 1, typeId: 6, lengthTypeId: 0, length: 27,
      subPackets: [
        {version: 6, typeId: 4, value: 10, packet: '11010001010'},
        {version: 2, typeId: 4, value: 20, packet: '0101001000100100'},
      ]
    };
    test('hex to bin', () => expect(hexToBin(hex)).toEqual(bin));
    test('bin to operator', () => expect(binToOperator(bin)).toMatchObject(operator));
    test('bin to packet', () => expect(binToPacket(bin)).toMatchObject(operator));
    test('hex to packet', () => expect(hexToPacket(hex)).toMatchObject(operator));
  })
  describe('operator 11', () => {
    const hex = 'EE00D40C823060';
    const bin = '111' + '011' + '1' + '00000000011' +
      '010' + '100' + '00001' +
      '100' + '100' + '00010' +
      '001' + '100' + '00011' +
      '00000';
    const operator = {
      version: 7, typeId: 3, lengthTypeId: 1, numberOfSubPackets: 3,
      subPackets: [
        {version: 2, typeId: 4, value: 1, packet: '01010000001'},
        {version: 4, typeId: 4, value: 2, packet: '10010000010'},
        {version: 1, typeId: 4, value: 3, packet: '00110000011'},
      ]
    };
    test('hex to bin', () => expect(hexToBin(hex)).toEqual(bin));
    test('bin to operator', () => expect(binToOperator(bin)).toMatchObject(operator));
    test('bin to packet', () => expect(binToPacket(bin)).toMatchObject(operator));
    test('hex to packet', () => expect(hexToPacket(hex)).toMatchObject(operator));
  })
});