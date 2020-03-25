const {
    PaperW,
    PaperS,
    Connection,
    Author
} = require('./db');
const paperW = new PaperW();
const paperS = new PaperS();
const connection = new Connection();
const author = new Author();


async function getScopus(eid) {
    let findScopusSome = await paperS.findSome(eid);
    return findScopusSome;
}

async function updateScopus(data) {
    await paperS.update([data]);
    return true;
}

async function getWos(eid) {
    let findWosSome = await paperW.findSome(eid);
    return findWosSome;
}

async function updateWos(data) {
    await paperW.update([data]);
    return true;
}

module.exports = {
    getScopus: getScopus,
    updateScopus: updateScopus,
    getWos: getWos,
    updateWos: updateWos
}