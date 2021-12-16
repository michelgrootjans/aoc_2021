const _ = require('lodash');
const hexDictionary = {
  '0': '0000',
  '1': '0001',
  '2': '0010',
  '3': '0011',
  '4': '0100',
  '5': '0101',
  '6': '0110',
  '7': '0111',
  '8': '1000',
  '9': '1001',
  'A': '1010',
  'B': '1011',
  'C': '1100',
  'D': '1101',
  'E': '1110',
  'F': '1111',
}
const binToInt = bin => parseInt(bin, 2);
const hexToBin = hex => _(hex).map(n => hexDictionary[n]).join('')

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

  const version = binToInt(bVersion);
  const typeId = binToInt(bTypeId);
  const value = binToInt(parsedValue.value);

  return {
    version,
    typeId,
    value,
    packet: bVersion + bTypeId + parsedValue.packet,
    rest: parsedValue.rest,
    versionSum: version,
  };
};

const binToOperator15 = packet => {
  if (packet.length < 7 + 15) throw `packet not big enough for an operator15: [${packet}]`
  const {bVersion, bTypeId} = versionAndType(packet);
  const version = binToInt(bVersion);
  const typeId = binToInt(bTypeId);
  const length = binToInt(packet.substr(7, 15));

  const subPackets = []
  let subPacket = {rest: packet.substr(7 + 15, length)}
  while (subPacket.rest.length > 5) {
    subPacket = binToPacket(subPacket.rest);
    subPackets.push(subPacket);
  }
  const rest = packet.substr(7 + 15 + length);

  return {
    version,
    typeId,
    lengthTypeId: 0,
    length,
    subPackets,
    versionSum: version + _(subPackets).map(p => p.versionSum).sum(),
    rest,
  };
};

const binToOperator11 = packet => {
  if (packet.length < 7 + 11) throw `packet not big enough for an operator11: [${packet}]`
  const {bVersion, bTypeId} = versionAndType(packet);
  const version = binToInt(bVersion);
  const typeId = binToInt(bTypeId);

  const numberOfSubPackets = binToInt(packet.substr(7, 11));

  const subPackets = []
  let subPacket = {rest: packet.substr(7 + 11)}
  for (let i = 0; i < numberOfSubPackets; i++) {
    subPacket = binToPacket(subPacket.rest);
    subPackets.push(subPacket);
  }
  const rest = subPacket.rest;

  return {
    version,
    typeId,
    lengthTypeId: 1,
    numberOfSubPackets,
    subPackets,
    versionSum: version + _(subPackets).map(p => p.versionSum).sum(),
    rest,
  };
};

const binToOperator = packet => {
  if (packet.length < 6) throw `packet to small to be an operator: [${packet}]`
  const lengthTypeId = binToInt(packet.substr(6, 1));
  if (lengthTypeId === 0) {
    return binToOperator15(packet);
  } else {
    return binToOperator11(packet);
  }
};

const binToPacket = packet => {
  const {bTypeId} = versionAndType(packet);
  const typeId = binToInt(bTypeId);
  if (typeId === 4) return binToLiteralValue(packet);
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
    test('8A004A801A8002F478', () => {
      expect(hexToBin(
        '8A00' + '4A80' + '1A80' + '02F4' + '78'))
        .toEqual(
          //8        A        0        0
          '1000' + '1010' + '0000' + '0000' +
          //4        A        8        0
          '0100' + '1010' + '1000' + '0000' +
          //1        A        8        0
          '0001' + '1010' + '1000' + '0000' +
          //0        2        F        4
          '0000' + '0010' + '1111' + '0100' +
          //7        8
          '0111' + '1000'
        );
    });
    test('620080001611562C8802118E34', () => {
      expect(hexToBin(
        '6200' + '8000' + '1611' + '562C' + '8802' + '118E' + '34'))
        .toEqual(
          //6       2        0        0
          '0110' + '0010' + '0000' + '0000' +
          //8       0        0        0
          '1000' + '0000' + '0000' + '0000' +
          //1       6        1        1
          '0001' + '0110' + '0001' + '0001' +
          //5       6        2        C
          '0101' + '0110' + '0010' + '1100' +
          //8       8        0        2
          '1000' + '1000' + '0000' + '0010' +
          //1       1        8        E
          '0001' + '0001' + '1000' + '1110' +
          //3       4
          '0011' + '0100'
        );
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
      rest: '000',
      versionSum: 6
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
        {version: 6, typeId: 4, value: 10, versionSum: 6, packet: '11010001010'},
        {version: 2, typeId: 4, value: 20, versionSum: 2, packet: '0101001000100100'},
      ],
      versionSum: 1 + 6 + 2,
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
        {version: 2, typeId: 4, value: 1, versionSum: 2, packet: '01010000001'},
        {version: 4, typeId: 4, value: 2, versionSum: 4, packet: '10010000010'},
        {version: 1, typeId: 4, value: 3, versionSum: 1, packet: '00110000011'},
      ],
      versionSum: 7 + 2 + 4 + 1,
    };
    test('hex to bin', () => expect(hexToBin(hex)).toEqual(bin));
    test('bin to operator', () => expect(binToOperator(bin)).toMatchObject(operator));
    test('bin to packet', () => expect(binToPacket(bin)).toMatchObject(operator));
    test('hex to packet', () => expect(hexToPacket(hex)).toMatchObject(operator));
  })
  describe('other examples', () => {
    test('8A004A801A8002F478', () => expect(hexToPacket('8A004A801A8002F478')).toMatchObject({
      version: 4, versionSum: 4 + 1 + 5 + 6, subPackets: [{
        version: 1, subPackets: [{
          version: 5, subPackets: [
            {version: 6}
          ]
        }]
      }]
    }));
    test('620080001611562C8802118E34', () => expect(hexToPacket('620080001611562C8802118E34')).toMatchObject(
      {
        version: 3, versionSum: 12, subPackets: [
          {subPackets: [{typeId: 4}, {typeId: 4}]},
          {subPackets: [{typeId: 4}, {typeId: 4}]},
        ]
      }
    ));
    test('C0015000016115A2E0802F182340', () => expect(hexToPacket('C0015000016115A2E0802F182340')).toMatchObject(
      {
        versionSum: 23, subPackets: [
          {subPackets: [{typeId: 4}, {typeId: 4}]},
          {subPackets: [{typeId: 4}, {typeId: 4}]},
        ]
      }
    ));
    test('A0016C880162017C3686B18A3D4780', () => expect(hexToPacket('A0016C880162017C3686B18A3D4780')).toMatchObject(
      {
        versionSum: 31, subPackets: [
          {subPackets: [
              {subPackets: [{typeId: 4},{typeId: 4},{typeId: 4},{typeId: 4},{typeId: 4}]}
            ]},
        ]
      }
    ));
  })
  describe('my input', () => {
    test('day16.input', () => expect(hexToPacket(require('./day16.input')))
      .toMatchObject({versionSum: 31}));
  })
});