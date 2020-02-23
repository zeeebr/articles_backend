const parserAuthors = require('./author');
const parserScopus = require('./scopus');
const parserWos = require('./wos');
const dataOutput = require('./output');
const count = require('./count');
const {
    sequelize
} = require('./db')
main()

async function main() {
    await parserAuthors('data/authors.csv');
    await parserScopus('data/scopus.csv');
    await parserWos('data/savedrecs.csv');
    await dataOutput();
    await count();
}