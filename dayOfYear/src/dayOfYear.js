function dayOfYear(year, month, day) {
  if (arguments.length !== 3 || Object.values(arguments).some((n) => typeof n !== 'number'))
    throw new Error();

  let md = 0;

  for (let m = 1; m < month; m++) {
    switch (m) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        md += 31;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        md += 30;
        break;
      case 2:
        md += isLeapYear(year) ? 29 : 28;
    }
  }
  return day + md;
}

function isLeapYear(year) {
  return year % 4 === 0 && !(year % 100 === 0 && year % 400 !== 0) ? true : false;
}

module.exports = dayOfYear;
