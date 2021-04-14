function fizzBuzz(n) {
  if (typeof n !== 'number') throw Error();
  else if (!n) return null;

  let res = '';

  if (!(n % 3)) res += 'Fizz';
  if (!(n % 5)) res += 'Buzz';
  if (!(n % 7)) res += 'Suzz';

  return res ? res : null;
}

module.exports = fizzBuzz;
