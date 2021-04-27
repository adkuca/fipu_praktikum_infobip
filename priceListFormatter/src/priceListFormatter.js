function priceListFormatter(data) {
  if (!Array.isArray(data) && !data.length) throw new Error();

  const orderedDataByPrice = [...data].sort((a, b) => a.price - b.price);
  const output = createOutput(orderedDataByPrice);

  console.log(output);
}

function createOutput(data) {
  let output = '';
  data.forEach((item, i, arr) => {
    const dateStr = `${item.from} do ${item.to}`;
    output +=
      arr[i - 1]?.price === item.price
        ? ` , ${dateStr}`
        : `\n${item.price.toFixed('1')} : ${dateStr}`;
  });

  return output.trimStart();
}

module.exports = priceListFormatter;
