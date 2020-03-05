const parserAuthors = require('./author');
const parserScopus = require('./scopus');
const parserWos = require('./wos');
const dataOutput = require('./output');
const count = require('./count');
const correction = require('./correction');

main()

async function main() {
    await parserAuthors('data/authors.csv');
    await parserScopus('data/scopus.csv');
    await parserWos('data/savedrecs.csv');
    await dataOutput();
    await count();
    return;
} 

/* module.exports = {
    parserAuthors : parserAuthors,
    parserScopus : parserScopus,
    parserWos : parserWos,
    dataOutput : dataOutput,
    count : count,
    correction : correction
} */