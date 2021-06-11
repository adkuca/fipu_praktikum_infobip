// const romanNumerals = {
//   1: 'I',
//   5: 'V',
//   10: 'X',
//   50: 'L',
//   100: 'C',
//   500: 'D',
//   1000: 'M',
// };

// const boundaries = Object.keys(romanNumerals)
// .map((n) => parseInt(n))
// .sort((a, b) => b - a);

// function arabic2roman(arabicNumber) {
//   const base = getBase(arabicNumber);
//   if (base.arabicNumber === arabicNumber) return base.roman;
//   // return base.roman.toString().repeat(arabicNumber - 1) + getFollowingRoman(base.roman);
//   else if (base.arabicNumber < arabicNumber)
//     return base.roman + arabic2roman(arabicNumber - base.arabicNumber);
// }

// function getBase(arabicNumber) {
//   const lowerOrEqualNumber = boundaries.find((val) => val <= arabicNumber);
//   return { arabicNumber: lowerOrEqualNumber, roman: romanNumerals[lowerOrEqualNumber] };
// }

// function getFollowingRoman(roman) {
//   const nextBoundaryIndex = boundaries.indexOf(roman);
//   return romanNumerals[nextBoundaryIndex - 1];
// }

const romanLettersMap = {
  1: ['I', 'V', 'X'],
  2: ['X', 'L', 'C'],
  3: ['C', 'D', 'M'],
  4: ['M'],
};

function arabic2roman(arabicNumber) {
  const romanValues = getRomanValuesPerDigitOfArabicNumber(arabicNumber);

  return romanValues.join('');
}

function getRomanValuesPerDigitOfArabicNumber(arabicNumber) {
  return arabicNumber
    .toString()
    .split('')
    .reduce((acc, number, i, arr) => {
      const digit = arr.length - i;
      const romanValue = getDigitsRomanValue(number, digit);
      romanValue && acc.push(romanValue);
      return acc;
    }, []);
}

function getDigitsRomanValue(number, digit) {
  if (digit === 4) return romanLettersMap[digit][0].repeat(number);

  switch (+number) {
    case 1:
    case 2:
    case 3:
      return romanLettersMap[digit][0].repeat(number);
    case 4:
      return romanLettersMap[digit][0] + romanLettersMap[digit][1];
    case 5:
      return romanLettersMap[digit][1];
    case 6:
    case 7:
    case 8:
      return romanLettersMap[digit][1] + romanLettersMap[digit][0].repeat(number - 5);
    case 9:
      return romanLettersMap[digit][0] + romanLettersMap[digit][2];
  }
}

module.exports = {
  arabic2roman,
};
