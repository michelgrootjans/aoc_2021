const range = (start, end) => {
  if (start > end) {
    return range(end, start);
  }
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
};

module.exports = range;