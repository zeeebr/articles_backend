const {
    Eids,
    NewEidS,
    NewEidW
} = require('./db');
const eids = new Eids();
const newEidS = new NewEidS();
const newEidW = new NewEidW();

//main();

async function main() {
    let newIdScopus = await newEidS.findAll(['eid']);

    await eids.save(newIdScopus)

    let newIdWos = await newEidW.findAll(['eid']);
    
    await eids.save(newIdWos)
}

module.exports = main;