const { trigramGenerator } = require('./trigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';
const writeFile = 'datoteka2.txt';

const text = fs.readFileSync(`${__dirname}/${readFile}`, 'utf8');

const result = trigramGenerator(text);

fs.writeFileSync(`${__dirname}/${writeFile}`, buildOutput(result), 'utf8');
console.log(result);

function buildOutput(map) {
  return Array.from(map).reduce(
    (output, [key, value]) => (output += `'${key}' => [ '${value.join("', '")}' ],\n`),
    ''
  );
}
