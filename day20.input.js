const dictionary = '#.#.#.....###.###..##...##.#.###..##..#.#..#.#..###.#.####.######......#.#..###.#....#.#...########....#.#..#.##.##.#.######..#..#..#.##.##.##..###..##.####.##.##.#.##.##..#.#..#####..##..#.##.#.#......###.#.#..#.#..##.###..###.#####.#...##.##.#.##..####..#.....####..........#...#.#..#..#..##.##....##...#.#..#.....#.##..####.#.##.#.##.#.####.##.#.##..#..##.#.##.###.....##.#.####...#.#.##..#..##...####..#.#.#...###....#..#.#..#..###..#..#..#...#.#.##.##.#...######.##..##.###.#.###.###..#......#..#..#.#...#..';

const inputImage =
  '##..#.#...#...#.#..#..##.#.#.##.##.####.##.#.#.##..##..##..#...##..##.#....##.#.####.##...#..#....##/n' +
  '###..#..#..##..#####..##.#.##.##.##.#...##......#...#..#.#..#.....#####...#.######...#.....#...##.##/n' +
  '..##.#..#......#.....##......##.###.###..#####..###.####.#.#....#.#.##..##....####..#.....###..#.##./n' +
  '#.##....#.....#.....#..####..##.####...#..#####.#.#.##.##.##.#..###...####..###.#...#.###..#..#..###/n' +
  '#.##..#....#.#..#.##....#..#...##.#..#..##.#.#####...#..###...##.#.#....#..#..#....##.#..##..##..#.#/n' +
  '...####.#.####..#.###.....##..#...##...#.######....####...#.#....##.#......#.#.##.##.###...#...#...#/n' +
  '##..##.#....#.....#.#.#####.#.####.#.#.#.#####.###..#.......###.#.###......###.##..##.#####.#.##.###/n' +
  '####.#..#####.##....###...##..###..#...###..###.####..#.##..##.#...####.....#..#.#..##...##.#.###.../n' +
  '.#..#...##...####.#.###......#..##...#.##.##.#.#.##.#..##.#.#.#.#..###...###..###..###...###....#.../n' +
  '#.#####..###....###..##....######.#.#..#...#.####.###.####..#.##..##..#.#.#.#..#####....##.##...##../n' +
  '....#.#.......#.#...#.##...#.#.##.#.###.#.####..#.####...########...#.###.#.#.....#.####.#..#..#.###/n' +
  '.##.###.##..#....##..#.##..###......#.##.##.##...#.#...##.#######.#.#.#..###..##..####....##...#..##/n' +
  '#....#..##..#.######....##.#.#........#..#.#..#.....#.#..##.#.#.##.##.#####..##...#.##..#..#....####/n' +
  '#..##..#.#.....###.#.###.##.#.#.###...###...###..##..##.##.......##......##.#.##.#...#.##..#....#..#/n' +
  '#.#.#.#.#.###..###.##..#..#........###..###.##..##.####.##....#..#.......#...###..#..#..#...#.....#./n' +
  '##...##.####..#####...#.#.##...##...####...##.##.##.#.#####..#..###.#.###.###.#.#.#..#...#.#.####..#/n' +
  '..#..##..#####.##..##...#....###..#.#.....##...######.#..##.#..#####..#.##.#.#.#..#..#.#######..###./n' +
  '.....#.#..####..##.###..###.....#.##...#.#.#...#..#...####.#....#..#...#.##...#..##..#.##....##.###./n' +
  '......#.#...####....##.#....##..####.#...##...##..#.#.#.###..#.#..##....##...##.#.#..##.##.....###.#/n' +
  '#.####..###..###.#...##..#.#.####..#...#.....###.##..###...#....#######.####.#...#.#.###..####...#.#/n' +
  '###...#.#...#..####.##..###...........#..#....#..#.####.#.......##.##.###.#.#....#.#.#.#...#.#..#.../n' +
  '.##.#.#.#.#...###...#...#..#.#.#...##..#..##....#...##..#.#..###.#....##.###....###...######.##.####/n' +
  '.....##....#....#.#######.#..##..#..#.....###..#....#.####.##.#..##.#...##..##.#.#.###....#..#...###/n' +
  '..##.#.###.#.####.#.#######.#...#.##.#..##.#####...#.###...###.##.#.###...#..#......########..##..#./n' +
  '####...#..##......#.#.###.#####.#....#..#..##.....#....##.#.#...###......###.#...#.##.#.......#...../n' +
  '#.##...#.##..###.#####..###..##.#..##..#..##.##..###...#.##.#..######.##.#...#.#.##....###.#..#.##.#/n' +
  '##.#...##.#.####.#.#.#...#..#.####.##.#..#.#.##...##.###..#..###..#.###....#.###.#.#.###.#...####.##/n' +
  '.##...#..#..##..#######...#..####...###..#..#.#..##.#.##.#..#..###.#.##..#.#...###...#######.####.##/n' +
  '##..#.##.#...###.........#.#..#..#.#..#.#..#...##.#.##......#.####.##..###..#.###.#.#####.###...#.#./n' +
  '...#.###.#..#....####.###.##..####.#.###..##.#.####.##...#.##..#.##.###....#.#.#.##......#.####...../n' +
  '.###.#######..#....####.#..#.#...####.#.....#.#.#.###.###.#.##.###.####..#####...#.....##...###....#/n' +
  '#..#..#.######.##.###.....###..##.#...###.#.#####...####..###..##.###...#..##....##...##.#.##.##..#./n' +
  '..##...#...#.####..##...#....#..#.##..###.####.##..###.#..####..##.#.####..####..##.#####..###.###../n' +
  '.#..#..#..#....##.#.#####.#.#......#.###.....#.####..#.#.#......#..#.#....#....####..###.#.....#..#./n' +
  '##.#.##....#...#...#.##.#..........####.##...#..#..##.###...#.#..##########..###.##.#.###.#.#.#.##.#/n' +
  '..#.##.####....##.#..#.##...##.##..##.###.##.....##..##..#.#.#.#.....#...#...##.#..#.....#####.####./n' +
  '#.#.#..####.####....###.##.##.....###..#####.#......#.#...#..###..##.###.#....#.#.#####.#..#.#######/n' +
  '##..###.#.##..####..#..#.#..##..#...###....#..##.####..##..##.##..###.###.####.#.##.###..##.####.#../n' +
  '..#.##.#.#####.#....###.#.#..#.###.#.#...##.#.#....#.##...#..#####..###..#.#.####.#...#.####...##.../n' +
  '...###.#..##.#.#...#..#.#.##.#.##.##.#.#.#####..###...#...#...#.#.###......#.##.#.#..#.###.##.####.#/n' +
  '#....#.##......##...##.....####.#.##..##.#..##.###########..#..##.#...##.##......##....#......##.#../n' +
  '##...#####.###.###..#.###....#.#.#..#..#.#####...###....#.##.#.####....#.#....######....#.#.##.####./n' +
  '....##....#..##......##.....#.##..####.##.##.#.#.#....#...#...##.##..#....#..##...#.#....#.#..#.###./n' +
  '...#.......#.#...#....#.#.#....#...#...##.##...###.####......#..###.##....######.##.####.##.....#.../n' +
  '####..###..##...#......##...##..#.#...###..####.###.#....##.###.#..##.#...##.##........####.#...###./n' +
  '..##.##.#..####..###.#..####...#..#.#..#...#.##..#..##.#######....#...##..#..#.#......#.#.####.#.#../n' +
  '####.#.#...##....###..#.#..#..#.#...####.###...#####..######.#.....#..###.##.##........###.##.##.###/n' +
  '.#.#..#....##.###..##.......###.#...#.######...#####.#..#######...##.##.#..#...#.....#...####.###..#/n' +
  '..#....##.....#....###..##.##..####.....###...#.#...####..###..##....#...###...####.##..########..../n' +
  '..........###...#.......##...####...#######....##..#.##.##.###..###...#######..#..####.##..#.##..##./n' +
  '#######...###...##.##..#.#....#..#..#...###..#..#.#.#..#..###..#....#...##....#..#.#.......#########/n' +
  '.#..##........##.......#.###..#.#.#####.##.#.####..#.#.##...#..#...#.#.##..##.#..##.#####.##....##.#/n' +
  '....##....##.#..#.#...#.....###....##...#.#.#...#.###.....#.#.....#..#####.#..##..#.#####........#../n' +
  '##.##.#....#..##..##.##.###..#.#.##..###.#..##...####.######.#.#.#...#..#.#.#...#.#..######.#....#../n' +
  '##.###.#......###..#.#..#.#..#...######.##.##.#####.####......######...####.##.#####...#..#...#.###./n' +
  '.#########....##..###..#.#....####.###.....#..#...##.###.##..####.#.##..#..#....##..###.##..##.#.##./n' +
  '#.#.#.###...#####..###.####.#####.##.#.#...##..##.#.#...###..##....###.#...##.###.....###...########/n' +
  '###.#.###.....#.#.#..#.#...###.##........#.####..#...###.#.##.####..###.#..#...##.#..##.#.#...#.##.#/n' +
  '..##.#..#.#..##.##.##...####..####.#####.##..#...####...##...###...#####.#####.##...###..#...#.#.##./n' +
  '##.#.#.#.####..#.##.#...#........##..#.###.###.#.....#..#..##.#####..##.#.####.#......###.#####..#.#/n' +
  '#.######.###...#.###..#..#.#.#.#.###.##..###.###..#.###..#####...##..####..##.######.#.##..#.#.##.../n' +
  '.##.#.#.####...###.......#.####...#..###.#.....#.#......##.#.##.###.#####....##.#.#.###......###.#../n' +
  '###..#.##.####....##.##.#..#.###........###.####....#...#...##...#..###.##.###..####.#.#.#.##.#...../n' +
  '###...#.###.....#...#.#.#..#.#....##.#.#.#.#.#..#..##.###.###...#....#####..####.##...##.#.###.#..##/n' +
  '..##......#..####...##.#..##.##.......##.####.#.#.###.###...##.#.###..###...########.##...#.##....##/n' +
  '.#...#.##..#..###.####.##.#.#.#..#..#.#....#..#..........#####.##.#.#.###.#.##....#...##.#.#.#..#.../n' +
  '..#...##..#.#.###.##..##..####.####..#.....####.##..#.#.#....#..##.##.#####...####.#..#.#...#....#.#/n' +
  '..##..#..#.#..........###.##..###..#...###.###...###..#.##.#####...####.##...####.##...#####.#.#..../n' +
  '..#..####.....###..#..##..##.#..#.####.##..##..#.#.##.##.##..#....#.####.#.#..##.#.####.#..#.##.#..#/n' +
  '.#.#.#############..###..##..######........##..###.#..###..##.....###.#.###.#.##.#.#.#.##.#..####..#/n' +
  '...#.###...#.#..#########.###.#..##..###.#.##......########.#....#######....#...#...###..#.#####..#./n' +
  '..########.####..#..#.#..#..##.#.##...###.#..####..#.#####...##.###.###.##..##.#.#..##...##.##.#.#../n' +
  '..##.##.#.......#.##..#.#.#####...#.#..#.#####...###.##....#....#..#..####...##....#......#....###../n' +
  '...#...#..#.###..##...##.##..##.#.###...#...###..###.#..#######..#..##..####..##.#.#.#.#..#.##..#.../n' +
  '.#####...##.##.#.#.#.###.#.#..##.....#..###...#..#.##.#...#.....#.#...#..#.#...#..#######.#.#######./n' +
  '#.##.#...###.#.##.#..#....##.##..#.##.##.#.##.##..#.#..##..#.#..#..#...##..####....#.##.#####....##./n' +
  '#..#..###.###.##...#########.##.#.###....##.###.###.#.##.#.###....#.#..#.....######...#.#.#....#.#../n' +
  '.....#.######.###.##.........##...#..#..#..##.##..#..###..##..#.#.##.#.#.###.......#.##.....####...#/n' +
  '.######.#.####...#.###......#..#.###.##.###.....##.#####..###...##.##.#...#.....#..#...##.#.#.#.####/n' +
  '.##..##.#.#..#..##..##.####.#...####......##...##.#####.###..#...#.##..#.#...#.#..#..#..#...#....###/n' +
  '...##.#..#.#..#.###.####.#.#.....#.#.#..##.##.#..#.###.#...##.####.#...#.##..#..####.#####..#.#.#..#/n' +
  '#.##.#..#..##.#..##...#.##.#.###...##.##..#.##.#.#..#..#..##..##.##.#.....#..##...#.#..#....#..####./n' +
  '#.##..###...##..####.##.#.##..##........###.#..###.#.####..####.#.##.#....#######.#####..##.#..#####/n' +
  '..###.#.#...##....##...##..#..#.#.#.....#..#.#.#.####...#..#...#..#......###.##..#####.####..####..#/n' +
  '..#...#.##..###.#.##..#...###..##.#####.###.#.#.......#.#....###.####..#..#.#..#...###.#.#..###..##./n' +
  '##.#.#.##.#..###.###......###..##..#..##.#..#.##.#..###..#.####...#..#####..#.####.##.#...#..#.##.#./n' +
  '..#.##.#......#..............##.###..##.###.#.#.##...##.#.......#######.#...#..##.#..####..#.##.#.##/n' +
  '.##..........##...###......#.#.....#.##.##.##..####..##.#.##.#..###.#..####..##.#..#..#.###.##..#..#/n' +
  '##...##...###...#.##..##.####.....#.#.####.##..##.##.##........#.##...##...###########...#..#..#...#/n' +
  '.##.##.#..##.#.########...###...###.#...#.####...#.###.##.###...#...###...##...#........##.##.###.#./n' +
  '##.#..###...######.#.#.#.#.#.#..........#..##...##..#....#..###..######.....#.#..##.#.#..##.##.##.#./n' +
  '###.##..#.##..#...#.#...#.##...#.###.#..#..#..##.##.##..#..#..###.#.##...##...#.#.##.###.....#.###.#/n' +
  '.##..#.##....#.#......###.##.#.##......##..#.##..##..#..##..########..##.#..##...#..#...###.#...#.##/n' +
  '.###..#.#.......#....#...#.#....###.#.###.##.##..#.#.....#...#####.#..####.##.##.#.#.#.....#####.#../n' +
  '##...##.#####.#....###.#.##.###.#.#.#..#..###..##..####..##..###.....##.#.########..#..##..#.#.#.###/n' +
  '..#.##.#.##..###..####.##..#..###....#..#....#.##..#.####.##.#...#.##.##..########.##.##.#.#.#...##./n' +
  '.#..###.######.#.###.##.#.##......##.###.##.#....#......###....####.##.###.#..##.####.#..###.#....../n' +
  '#.....###....##.....###.#..#....#.#...#.#....#.##.######.####.###########...#..#..#..##.#.##.##....#/n' +
  '.##.#.#..#...#.#.##..#...####..#.#.#...##..#..#..##...####.#...######.....##...##.##.#..###.###..#../n' +
  '..#.#..##....##...####.#...#...###..#......#.##....#.##...##......####.##.#.##.#.#.#..#...#..##..#..';

module.exports = {dictionary, inputImage}