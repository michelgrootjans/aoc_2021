function add(left, right) {
  return [left, right];
}

function reduce(number) {
  return [[[[0,9],2],3],4];
}

function explode(number) {
  return [0, 9];
}

describe('Snailfish', () => {
  describe('addition', () => {
    test('simple example', () => {
      expect(add([1, 2], [[3, 4], 5])).toEqual([[1, 2], [[3, 4], 5]])
    });
  })
  describe('reduction', () => {
    describe('explosion', () => {
      test('explode', () => {
        expect(explode([[9,8],1])).toEqual([0, 9])
      });
      xtest('simple example', () => {
        expect(reduce([[[[[9,8],1],2],3],4])).toEqual([[[[0,9],2],3],4])
      });
    })
  })
})
