function priceListFormatter(data) {
  if (!Array.isArray(data) && !data.length) throw new Error();

  const orderedDataByPrice = [...data].sort((a, b) => a.price - b.price);
  const output = createOutput(orderedDataByPrice);

  console.log(output);
}

function createOutput(data) {
  let output = '';
  data.forEach((item) => (output += `\n${item.price.toFixed('1')} : ${item.from} do ${item.to}`));

  return output.trimStart();
}

module.exports = priceListFormatter;
