const { generateRandomText } = require('./generateRandomText.js');
const { bigramGenerator } = require('../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../trigramGenerator/trigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';
const writeFile = 'datoteka2.txt';

const text = fs.readFileSync(`${__dirname}/${readFile}`, 'utf8');

const bigramMap = bigramGenerator(text);
const trigramMap = trigramGenerator(text);

const randomText = generateRandomText(1000, bigramMap, trigramMap);

fs.writeFileSync(`${__dirname}/${writeFile}`, randomText, 'utf8');
console.log(randomText);

fs.writeFileSync(`${__dirname}/bigramMap.txt`, buildOutput(bigramMap), 'utf8');
fs.writeFileSync(`${__dirname}/trigramMap.txt`, buildOutput(trigramMap), 'utf8');

function buildOutput(map) {
  return Array.from(map).reduce(
    (output, [key, value]) => (output += `'${key}' => [ '${value.join("', '")}' ],\n`),
    ''
  );
}
