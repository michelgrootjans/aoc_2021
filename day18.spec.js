function add(left, right) {
  return [left, right];
}

describe('Snailfish', () => {
  describe('magnitude of the final sum', () => {
    test('simple example', () => {
      expect(add([1, 2], [[3, 4], 5])).toEqual([[1, 2], [[3, 4], 5]])
    });
  })
})
