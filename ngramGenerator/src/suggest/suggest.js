function suggest(searchText, ngramMap) {
  if (typeof searchText !== 'string' || !(ngramMap instanceof Map)) throw new Error();

  const possibleSuggestions = ngramMap.get(searchText);
  if (!possibleSuggestions) return [];

  const suggestions = createDistinctArrayOrderedByElementsFrequencyDESC(possibleSuggestions);

  return suggestions.slice(0, 5);
}

function createDistinctArrayOrderedByElementsFrequencyDESC(array) {
  const mapWithElementsFrequencies = createMapWithElementsFrequencies(array);
  return Array.from(mapWithElementsFrequencies)
    .sort((a, b) => b[1] - a[1])
    .map((v) => v[0]);
}

function createMapWithElementsFrequencies(array) {
  return array.reduce(function (map, curr) {
    const mapValue = map.get(curr);
    return map.set(curr, mapValue ? mapValue + 1 : 1);
  }, new Map());
}

module.exports = { suggest };
