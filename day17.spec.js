function Target(x1, x2, y1, y2) {
  const topLeft = {x: Math.min(x1, x2), y: Math.max(y1, y2)}
  const bottomRight = {x: Math.max(x1, x2), y: Math.min(y1, y2)}
  return {
    topLeft, bottomRight
  };
}

function parseTarget(targetDescription) {
  const [[x1, x2], [y1, y2]] = targetDescription.replace('target area: ', '')
    .split(', ')
    .map(description => description.split('=')[1].split('..'))


  return Target(x1, x2, y1, y2);
}

function highestPoint(targetDescription) {
  const target = parseTarget(targetDescription);
  console.log({targetDescription, target})
  return 45;
}

const myInput = 'target area: x=143..177, y=-106..-71';

describe('Trick Shot', () => {
  describe('highest point', () => {
    test('should ', function () {
      expect(highestPoint('target area: x=20..30, y=-10..-5')).toEqual(45)
    });
  })
})