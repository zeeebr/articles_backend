const {PaperS, PaperW, Author, Connection, Done, Eids} = require('./db')

/*const paperS = new PaperS();
const paperW = new PaperW();
const author = new Author();
const connection = new Connection();*/
const done = new Done();
//const eids = new Eids();

/*paperS.sync();
paperW.sync();
author.sync();
connection.sync();*/
done.sync();
//eids.sync();

console.log('\x1b[36m%s\x1b[0m', 'Done!')