function priceListFormatter(data) {
  if (!Array.isArray(data) && !data.length) throw new Error();
}

module.exports = priceListFormatter;
