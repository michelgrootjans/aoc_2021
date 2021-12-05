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
    if (coordinates) {
      const newGrid = Array2D.set(data, coordinates[0], coordinates[1], 0);
      return Board(newGrid)
    }
    return Board(data);
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
      for (const number of draws) {
        if (boards.length === 1) {
          boards = boards.map(b => b.draw(number));
          if(boards[0].winner()) return boards[0].sum() * number;
        } else {
          boards = boards.map(b => b.draw(number)).filter(b => !b.winner());
        }
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
  test('aoc example', () => {
    const draws = [7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26, 1]
    const boards = [
      [
        [22, 13, 17, 11, 0],
        [8, 2, 23, 4, 24],
        [21, 9, 14, 16, 7],
        [6, 10, 3, 18, 5],
        [1, 12, 20, 15, 19]
      ],
      [
        [3, 15, 0, 2, 22],
        [9, 18, 13, 17, 5],
        [19, 8, 7, 25, 23],
        [20, 11, 10, 24, 4],
        [14, 21, 16, 12, 6]
      ],
      [
        [14, 21, 17, 24, 4],
        [10, 16, 15, 9, 19],
        [18, 8, 23, 26, 20],
        [22, 11, 13, 6, 5],
        [2, 0, 12, 3, 7]
      ]
    ]

    expect(bingo(boards).draw(draws)).toEqual(148 * 13)
  });
  test('my input', () => {
    const {boards, draws} = require('./day4.input')
    expect(bingo(boards).draw(draws)).toEqual(24628)
  });
});