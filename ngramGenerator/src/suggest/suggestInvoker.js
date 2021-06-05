const { suggest } = require('./suggest.js');
const { bigramGenerator } = require('../bigramGenerator/bigramGenerator.js');
const { trigramGenerator } = require('../trigramGenerator/trigramGenerator.js');
const fs = require('fs');

const readFile = 'datoteka1.txt';

const text = fs.readFileSync(`./${readFile}`, 'utf8');

const words = process.argv.slice(2);

let suggestions;
if (words.length === 2) suggestions = suggest(`${words[0]} ${words[1]}`, trigramGenerator(text));
else if (words.length === 1) suggestions = suggest(words[0], bigramGenerator(text));

console.log('input: ', words.join(' '));
console.log(suggestions || 'wrong input - up to two words are valid input');
