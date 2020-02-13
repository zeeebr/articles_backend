const parserAuthors = require('./author');
const parserScopus = require('./scopus');
const parserWos = require('./wos');
const dataOutput = require('./output');

main ()

async function main() {
    //await parserAuthors('data/authors.csv');
    await parserScopus('data/scopus1.csv');
    await parserWos('data/savedrecs2.csv');
    //await dataOutput();
}