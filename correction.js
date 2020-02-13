const {PaperW, PaperS, Connection, Author} = require('./db');
const paperW = new PaperW();
const paperS = new PaperS();
const connection = new Connection();
const author = new Author();
const fs = require('fs').promises;

main();

async function main() {
    let wos = 'WOS:000349578600049'
    await writeOneWos(wos)
    //await updateOneWos()
    //await findIncludeScopus(id)
    await findIncludeWos(wos)
}

async function writeOneWos(eid) {
    let findWosSome = await paperW.findSome(eid)

    //console.log(findWosSome)
    
    fs.writeFile('arr.json', JSON.stringify(findWosSome))
}

async function updateOneWos() {
    let data = await fs.readFile('arr.json', 'utf-8');
    
    console.log(JSON.parse(data))

    await paperW.update(JSON.parse(data))
}

async function findIncludeScopus(id) {
    paperS.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    author.model.belongsToMany(paperS.model, { through: connection.model, foreignKey:'authorId' })
    
    let findAllIncludeS = await paperS.findAllInclude(id)
}

async function findIncludeWos(id) {
    paperW.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    author.model.belongsToMany(paperW.model, { through: connection.model, foreignKey:'authorId' })
    
    let findAllIncludeW = await paperW.findAllInclude(id)
    console.log(findAllIncludeW)
}