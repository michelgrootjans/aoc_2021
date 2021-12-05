const range = (start, end) => {
  if (start > end) return range(end, start).reverse();
  return Array(end - start + 1).fill().map((_, idx) => start + idx);
};

module.exports = range;