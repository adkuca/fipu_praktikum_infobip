function priceListFormatter(data) {
  if (!Array.isArray(data) || !data.length) throw new Error();

  const orderedDataByPrice = [...data].sort((a, b) => a.price - b.price);
  const dataMap = createMapByPrice(orderedDataByPrice);
  const output = createOutput(dataMap);

  console.log(output);
}

// function createMapByPrice(data) {
//   const map = new Map();
//   data.forEach((item) => {
//     const dateObj = ({ from, to } = item);
//     const r = map.get(item.price);
//     map.set(item.price, r ? [...r, dateObj] : [dateObj]);
//   });

//   return map;
// }

function createMapByPrice(data) {
  return data.reduce((map, item) => {
    const dateObj = ({ from, to } = item);
    const r = map.get(item.price);
    return map.set(item.price, r ? [...r, dateObj] : [dateObj]);
  }, new Map());
}

// function createOutput(data) {
//   let output = '';
//   data.forEach((value, key) => {
//     const dateStr = value.map((dateObj) => `${dateObj.from} do ${dateObj.to}`).join(' , ');
//     output += `${key.toFixed('1')} : ${dateStr}\n`;
//   });

//   return output.trimEnd();
// }

function createOutput(data) {
  return Array.from(data)
    .reduce((output, [key, value]) => {
      const dateStr = value.map((dateObj) => `${dateObj.from} do ${dateObj.to}`).join(' , ');
      return (output += `${key.toFixed('1')} : ${dateStr}\n`);
    }, '')
    .trimEnd();
}

module.exports = priceListFormatter;
