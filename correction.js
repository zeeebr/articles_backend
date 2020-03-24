const {PaperW, PaperS, Connection, Author} = require('./db');
const paperW = new PaperW();
const paperS = new PaperS();
const connection = new Connection();
const author = new Author();
const fs = require('fs').promises;

//main('2-s2.0-84978388574');

async function main(eid) {
    let wos = 'WOS:000512402800001';
    let s = '2-s2.0-85079907769';
    
    //await writeOneScopus('2-s2.0-85041402716')
    //await writeOneWos(wos)
    //await updateOneScopus()
    //await updateOneWos(wos)
    //await findErrorScopus()
    //await updateErrorScopus()
    //return await findIncludeScopus(eid)
    //await findIncludeWos(wos)
}

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
    console.log([data])
    //await paperW.update([data]);
    return true;
}

module.exports = {
    getScopus : getScopus,
    updateScopus : updateScopus,
    getWos : getWos,
    updateWos : updateWos

}