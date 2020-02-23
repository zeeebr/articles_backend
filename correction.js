const {PaperW, PaperS, Connection, Author} = require('./db');
const paperW = new PaperW();
const paperS = new PaperS();
const connection = new Connection();
const author = new Author();
const fs = require('fs').promises;

main();

async function main() {
    let wos = 'WOS:000500303500002';
    let scopus = '2-s2.0-85072884314';
    //await writeOneScopus(scopus)
    //await writeOneWos(wos)
    //await updateOneScopus()
    //await updateOneWos()
    //await findErrorScopus()
    //await updateErrorScopus()
    //await findIncludeScopus(scopus)
    await findIncludeWos(wos)
}

async function writeOneScopus(eid) {
    let findScopusSome = await paperS.findSome(eid)

    console.log(findScopusSome)
    
    fs.writeFile('arrScopus.json', JSON.stringify(findScopusSome))
}

async function updateOneScopus() {
    let data = await fs.readFile('arrScopus.json', 'utf-8');
    
    console.log(JSON.parse(data))

    await paperS.update(JSON.parse(data))
}

async function writeOneWos(eid) {
    let findWosSome = await paperW.findSome(eid)

    //console.log(findWosSome)
    
    fs.writeFile('arrWos.json', JSON.stringify(findWosSome))
}

async function updateOneWos() {
    let data = await fs.readFile('arrWos.json', 'utf-8');
    
    console.log(JSON.parse(data))

    await paperW.update(JSON.parse(data))
}

async function findErrorScopus(id) {
    let errors = JSON.parse(await fs.readFile('errorConnectionScopus.json', 'utf-8'));

    console.log(errors.length+' errors of connections in Scopus articles find')

    let arrScopusPaperError = []
    for(let i = 0; i < errors.length; i++) {
        let findScopusSome = await paperS.findSome(errors[i]['paperId'])
        arrScopusPaperError.push({
            eid: findScopusSome[0]['eid'],
            type: findScopusSome[0]['type'],
            topic: findScopusSome[0]['topic'],
            doi: findScopusSome[0]['doi'],
            journal: findScopusSome[0]['journal'],
            issn: findScopusSome[0]['issn'],
            volume: findScopusSome[0]['volume'],
            issue: findScopusSome[0]['issue'],
            pages: findScopusSome[0]['pages'],
            author: findScopusSome[0]['author'],
            ourAuthors: findScopusSome[0]['ourAuthors'],
            affil: findScopusSome[0]['affil'],
            year: findScopusSome[0]['year'],
            frezee: findScopusSome[0]['frezee'],
        })
    }
    //console.log(arrScopusPaperError)
    fs.writeFile('arrScopus.json', JSON.stringify(arrScopusPaperError))
}

async function updateErrorScopus() {
    let data = await fs.readFile('arrScopus.json', 'utf-8');
    
    //console.log(JSON.parse(data))

    await paperS.update(JSON.parse(data))
}

async function findIncludeScopus(id) {
    paperS.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    author.model.belongsToMany(paperS.model, { through: connection.model, foreignKey:'authorId' })
    
    let findAllIncludeS = await paperS.findAllIncludeId(id)
    console.log(findAllIncludeS)
}

async function findIncludeWos(id) {
    paperW.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    author.model.belongsToMany(paperW.model, { through: connection.model, foreignKey:'authorId' })
    
    let findAllIncludeW = await paperW.findAllIncludeId(id)
    console.log(findAllIncludeW)
}