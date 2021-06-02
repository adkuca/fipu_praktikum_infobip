const { suggest } = require('./suggest.js');
const { bigramGenerator } = require('../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../trigramGenerator/trigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';

const text = fs.readFileSync(`./${readFile}`, 'utf8');

const bigramMap = bigramGenerator(text);
const trigramMap = trigramGenerator(text);

const words = process.argv.slice(2);

let suggestions;
if (words.length === 2) suggestions = suggest(`${words[0]} ${words[1]}`, trigramMap);
else if (words.length === 1) suggestions = suggest(words[0], bigramMap);

console.log('input: ', words.join(' '));
console.log(suggestions);
