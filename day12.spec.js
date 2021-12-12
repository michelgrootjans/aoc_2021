const numberOfPaths = () => 1;

describe('Passage Pathing', () => {
  test('start-end', function () {
    expect(numberOfPaths(['start-end'])).toEqual(1)
  });
  xtest('aoc example 1', function () {
    expect(numberOfPaths([
      'start-A',
      'start-b',
      'A-c',
      'A-b',
      'b-d',
      'A-end',
      'b-end'
    ])).toEqual(10)
  });
  xtest('aoc example 2', function () {
    expect(numberOfPaths([
      'dc-end',
      'HN-start',
      'start-kj',
      'dc-start',
      'dc-HN',
      'LN-dc',
      'HN-end',
      'kj-sa',
      'kj-HN',
      'kj-dc'
    ])).toEqual(19)
  });
})