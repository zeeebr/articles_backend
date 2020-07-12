const {
    Author,
    Connection,
    Eids
} = require('./models');
const {
    PaperS,
    NewEidS
} = require('./models/scopus');
const {
    testMiddleName
} = require('./utils');
const paperS = new PaperS();
const author = new Author();
const connection = new Connection();
const eids = new Eids();
const newEidS = new NewEidS();
const scopusExport = require('./scopusExport');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


async function main(data) {
    await parserScopus(data);
    await newEidsScopus();
    await parserAuthors();
    await parserConnections();
    await scopusExport();
    
    return true;
}

// Writes all Scopus records from API to the DB
async function parserScopus(ScopusData) {
    let arrScopusData = [];
    for (let i in ScopusData) {
        arrScopusData.push({
            eid: ScopusData[i]['EID'],
            type: ScopusData[i]['Тип документа'],
            topic: ScopusData[i]['Название'],
            doi: ScopusData[i]['DOI'],
            journal: ScopusData[i]['Название источника'],
            issn: (ScopusData[i]['ISSN'] != '') ? `${ScopusData[i]['ISSN']}` : ScopusData[i]['ISBN'],
            volume: ScopusData[i]['Том'],
            issue: ScopusData[i]['Выпуск '],
            pages: (ScopusData[i]['Страница начала'] != '' && ScopusData[i]['Страница окончания'] != '') ? `${ScopusData[i]['Страница начала']}-${ScopusData[i]['Страница окончания']}` : ScopusData[i]['Статья №'],
            author: ScopusData[i]['Авторы'],
            affil: ScopusData[i]['Авторы организаций'],
            year: ScopusData[i]['Год'],
            frezee: false
        });
    }
    
    await paperS.save(arrScopusData);
    await client.set('statusScopus', `15%`)

    let status = await client.get('statusScopus')
    console.log(status)

    return true;
}

// Records new eids in DB
async function newEidsScopus() {
    let findAllScopus = await paperS.findAll(['eid', 'year'], [{
        all: true
    }]);
    let oldId = await eids.findAll(['id', 'eid']);

    let newEidsScopus = [];
    
    for (let i = 0; i < findAllScopus.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllScopus[i]['eid']);
        !findEid && newEidsScopus.push({
            eid: findAllScopus[i]['eid'],
            year: findAllScopus[i]['year']
        });
    }

    await newEidS.save(newEidsScopus);
    await client.set('statusScopus', `30%`)

    let status = await client.get('statusScopus')
    console.log(status)

    return true;
}

// Parses organization employees
async function parserAuthors() {
    let authorScopus = await paperS.findAllFalse(['eid', 'author', 'affil'])
    
    let arrScopusAuthors = [];
    for (let i = 0; i < authorScopus.length; i++) {
        let arrAuthors = authorScopus[i].author.split(', ');
        let arrAffils = authorScopus[i].affil.split('; ');
        arrOurAuthors = [];
        for (let k = 0; k < arrAffils.length; k++) {
            let element = arrAffils[k].toLowerCase()
            if ((element.includes('tyumen') && element.includes('industrial') && element.includes('university')) ||
                (element.includes('tyumen') && element.includes('industrial') && element.includes('univeristy')) ||
                (element.includes('tumen') && element.includes('industrial') && element.includes('university')) ||
                (element.includes('tyumen') && element.includes('oil') && element.includes('gas')) ||
                (element.includes('tymen') && element.includes('oil') && element.includes('gas')) ||
                (element.includes('tumen') && element.includes('oil') && element.includes('gas')) ||
                (element.includes('tiu')) ||
                (element.includes('tsogu')) ||
                (element.includes('tyumen') && element.includes('civil') && element.includes('university'))) {
                arrOurAuthors.push(arrAuthors[k])
            }
        }
        let ourAuthors = arrOurAuthors.join(', ')
        arrScopusAuthors.push({
            eid: authorScopus[i]['eid'],
            ourAuthors: ourAuthors
        })
    }
    
    await paperS.saveOurAuthors(arrScopusAuthors);
    await client.set('statusScopus', `45%`)

    let status = await client.get('statusScopus')
    console.log(status)

    return true;
}

// Records connections between articles and authors
async function parserConnections() {
    let allOurAuthors = await paperS.findAll(['eid', 'ourAuthors'])
    let allOurNames = await author.findAll(['id', 'shortName', 'name'])

    let arrConnection = []
    let errConnection = []
    for (let i = 0; i < allOurAuthors.length; i++) {
        let nameAuthor = allOurAuthors[i].ourAuthors.split(', ');
        for (let k = 0; k < nameAuthor.length; k++) {
            let resultMiddleName = testMiddleName(nameAuthor[k])
            let findName = allOurNames.find(item => (resultMiddleName) ? item.name == nameAuthor[k] : item.shortName == nameAuthor[k])
            if (findName) {
                arrConnection.push({
                    paperId: allOurAuthors[i]['eid'],
                    authorId: findName['id']
                })
            } else {
                errConnection.push({
                    paperId: allOurAuthors[i]['eid']
                })
            }
        }
    }

    await connection.save(arrConnection)
    await client.set('statusScopus', `60%`)

    let status = await client.get('statusScopus')
    console.log(status)

    return true;
}

module.exports = main;