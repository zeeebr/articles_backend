const parserAuthors = require('./author');
const parserScopus = require('./scopus');
const parserWos = require('./wos');
const exportS = require('./scopusExport');
const updEids = require('./updEids');

module.exports = {
    parserAuthors : parserAuthors,
    parserScopus : parserScopus,
    parserWos : parserWos,
    exportS : exportS,
    updEids : updEids
}