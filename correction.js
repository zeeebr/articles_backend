const {
    Author,
    Connection
} = require('./models');
const {
    PaperS
} = require('./models/scopus');
const {
    PaperW
} = require('./models/wos');
const author = new Author();
const connection = new Connection();
const paperS = new PaperS();
const paperW = new PaperW();


async function getScopus(eid) {
    let findScopusSome = await paperS.findSome(eid);
    return findScopusSome;
}

async function getScopusConnecion(eid) {
    paperS.model.belongsToMany(author.model, {
        through: connection.model,
        foreignKey: 'paperId'
    })
    author.model.belongsToMany(paperS.model, {
        through: connection.model,
        foreignKey: 'authorId'
    })

    let findConnetions = await paperS.findAllIncludeId(eid);
    return findConnetions;
}

async function updateScopus(data) {
    await paperS.update([data]);
    return true;
}

async function getWos(eid) {
    let findWosSome = await paperW.findSome(eid);
    return findWosSome;
}

async function getWosConnecion(eid) {
    paperW.model.belongsToMany(author.model, {
        through: connection.model,
        foreignKey: 'paperId'
    })
    author.model.belongsToMany(paperW.model, {
        through: connection.model,
        foreignKey: 'authorId'
    })

    let findConnetions = await paperW.findAllIncludeId(eid);
    return findConnetions;
}

async function updateWos(data) {
    await paperW.update([data]);
    return true;
}

async function deleteScopus(id) {
    await paperS.delete(id);
    return true;
}

async function deleteWos(id) {
    await paperW.delete(id);
    return true;
}

module.exports = {
    getScopus: getScopus,
    getScopusConnecion: getScopusConnecion,
    updateScopus: updateScopus,
    getWos: getWos,
    getWosConnecion : getWosConnecion,
    updateWos: updateWos,
    deleteScopus: deleteScopus,
    deleteWos: deleteWos
}