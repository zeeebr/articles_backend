const {PaperS, PaperW, Author, Connection, ExportS, ExportW, Eids} = require('./db')

/*const paperS = new PaperS();
const paperW = new PaperW();
const author = new Author();
const connection = new Connection();*/
const exportS = new ExportS();
const exportW = new ExportW();
//const eids = new Eids();

/*paperS.sync();
paperW.sync();
author.sync();
connection.sync();*/
exportS.sync();
exportW.sync();
//eids.sync();

console.log('\x1b[36m%s\x1b[0m', 'Done!')