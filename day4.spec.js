const Array2D = require('array2d');

function Line(numbers) {
  return {
    sum: () => numbers.reduce((acc, number) => acc + number, 0)
  }
}

const Board = (data) => {
  const rows = () => [0, 1, 2, 3, 4].map(index => Line(Array2D.row(data, index)));
  const columns = () => [0, 1, 2, 3, 4].map(index => Line(Array2D.column(data, index)));

  const draw = (number) => {
    const coordinates = Array2D.find(data, cell => cell === number)[0];
    const newGrid = Array2D.set(data, coordinates[0], coordinates[1], 0);
    return Board(newGrid)
  };
  return {
    draw,
    winner: () => {
      return rows().some(r => r.sum() === 0)
        || columns().some(r => r.sum() === 0);
    },
    sum: () => Line(Array2D.flatten(data)).sum(),
  }
};

const bingo = data => {
  let boards = data.map(Board);
  return ({

    draw: (draws) => {
      for (const currentDraw of draws) {
        boards = boards.map(b => b.draw(currentDraw))
        const winningBoard = boards.find(b => b.winner());
        if(winningBoard) return winningBoard.sum() * currentDraw;
      }
      return 0;
    }
  });
};

describe('dive', () => {
  test('one board', () => {
    const state = {
      draws: [10, 20, 30, 40, 50],
      boards:
        [
          [
            [10, 20, 30, 40, 50], //150
            [11, 21, 31, 41, 51], //155
            [12, 22, 32, 42, 52], //160
            [13, 23, 33, 43, 53], //165
            [14, 24, 34, 44, 54], //170
          ]
        ],
    };
    expect(bingo(state.boards).draw(state.draws)).toEqual((155 + 160 + 165 + 170) * 50)
  });
});