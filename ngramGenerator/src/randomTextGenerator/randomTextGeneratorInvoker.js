const { randomTextGenerator } = require('./randomTextGenerator.js');
const { bigramGenerator } = require('../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../trigramGenerator/trigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';
const writeFile = 'datoteka2.txt';

const text = fs.readFileSync(`./${readFile}`, 'utf8');

const bigramMap = bigramGenerator(text);
const trigramMap = trigramGenerator(text);

const result = randomTextGenerator(100, bigramMap, trigramMap);

fs.writeFileSync(`./${writeFile}`, result, 'utf8');
console.log(result);
