function consumption(values) {
  const string = values[0];
  const gamma = parseInt(string, 2);
  const epsilon = gamma ^ parseInt('11111', 2);

  return {gamma: gamma, epsilon: epsilon};
}

describe('consuption', () => {
  test('one value', () => {
    expect(consumption(['00100'])).toEqual({
      gamma:   parseInt('00100', 2),
      epsilon: parseInt('11011', 2)});
  });
});