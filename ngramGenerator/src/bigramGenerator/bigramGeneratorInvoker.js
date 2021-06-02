const { bigramGenerator } = require('./bigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';
const writeFile = 'datoteka2.txt';

const text = fs.readFileSync(`./${readFile}`, 'utf8');

const result = bigramGenerator(text);

fs.writeFileSync(`./${writeFile}`, buildOutput(result), 'utf8');
console.log(result);

function buildOutput(map) {
  return Array.from(map).reduce(
    (output, [key, value]) => (output += `'${key}' => [ '${value.join("', '")}' ],\n`),
    ''
  );
}
