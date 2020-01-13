const {PaperS, PaperW, Author} = require('./db')

const paperS = new PaperS();
const paperW = new PaperW();
const author = new Author();

paperS.sync();
paperW.sync();
author.sync();