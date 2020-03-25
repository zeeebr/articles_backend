const parserAuthors = require('./author');
const parserScopus = require('./scopus');
const parserWos = require('./wos');
const exportS = require('./scopusExport');
const count = require('./count');
const updEids = require('./updEids');

module.exports = {
    parserAuthors : parserAuthors,
    parserScopus : parserScopus,
    parserWos : parserWos,
    exportS : exportS,
    count : count,
    updEids : updEids
}