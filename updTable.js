const {PaperS, PaperW, Author, Connection} = require('./db')

/*const paperS = new PaperS();
const paperW = new PaperW();
const author = new Author();*/
const connection = new Connection();

/*paperS.sync();
paperW.sync();
author.sync();*/
connection.sync();