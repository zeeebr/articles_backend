const {
    Author,
    Connection,
    Eids
} = require('./models');
const {
    PaperW,
    NewEidW
} = require('./models/wos');
const {
    testMiddleName,
    initials
} = require('./utils');
const paperW = new PaperW();
const author = new Author();
const connection = new Connection();
const eids = new Eids();
const newEidW = new NewEidW();
const wosExport = require('./wosExport');
const asyncRedis = require('async-redis');
const client = asyncRedis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

async function main(data) {
    await parserWos(data);
    await newEidsWos();
    await parserAuthors();
    await parserConnections();
    await wosExport();

    return true;
}

// Writes all WoS records from the CSV to the DB
async function parserWos(WosData) {
    let arrWosData = [];
    for (let i in WosData) {
        arrWosData.push({
            eid: WosData[i]['UT'],
            type: WosData[i]['DT'],
            topic: WosData[i]['TI'],
            doi: WosData[i]['DI'],
            journal: WosData[i]['SO'],
            issn: (WosData[i]['SN'] != '') ? `${WosData[i]['SN']}` : WosData[i]['EI'],
            volume: WosData[i]['VL'],
            issue: WosData[i]['IS'],
            pages: (WosData[i]['BP'] != '' && WosData[i]['EP'] != '') ? `${WosData[i]['BP']}-${WosData[i]['EP']}` : WosData[i]['AR'],
            author: WosData[i]['AF'],
            affil: WosData[i]['C1'],
            year: WosData[i]['PY'],
            frezee: false
        });
    }
    
    await paperW.save(arrWosData);
    await client.set('statusWos', `15%`)

    let status = await client.get('statusWos')
    console.log(status)

    return true;
}

// Records new eids in DB
async function newEidsWos() {
    let findAllWos = await paperW.findAll(['eid', 'year'], [{
        all: true
    }]);
    let oldId = await eids.findAll(['id', 'eid']);

    let newEidsWos = [];
    
    for (let i = 0; i < findAllWos.length; i++) {
        let findEid = oldId.find(item => item.eid == findAllWos[i]['eid']);
        !findEid && newEidsWos.push({
            eid: findAllWos[i]['eid'],
            year: findAllWos[i]['year']
        });
    }

    //console.log(newEids)
    await newEidW.save(newEidsWos);

    await client.set('statusWos', `30%`)

    let status = await client.get('statusWos')
    console.log(status)

    return true;
}

// Parses organization employees
async function parserAuthors() {
    let authorWos = await paperW.findAllFalse(['eid', 'affil'])
    //console.log(authorWos)
    let arrWosAuthors = [];
    for (let i = 0; i < authorWos.length; i++) {
        let arrAffils = authorWos[i].affil.split('; [');
        arrOurAuthors = [];
        for (let k = 0; k < arrAffils.length; k++) {
            let element = arrAffils[k].toLowerCase()
            if ((element.includes('tyumen') && element.includes('ind') && element.includes('univ')) ||
                (element.includes('tiumen') && element.includes('ind') && element.includes('univ')) ||
                (element.includes('tyumen') && element.includes('oil') && element.includes('gas')) ||
                (element.includes('tumen') && element.includes('oil') && element.includes('gas')) ||
                (element.includes('tyumen') && element.includes('petr') && element.includes('univ')) ||
                (element.includes('tyumen') && element.includes('ind') && element.includes('inst')) ||
                (element.includes('iut')) ||
                (element.includes('tiu')) ||
                (element.includes('tyumen') && element.includes('civil') && element.includes('univ')) ||
                (element.includes('tyumen') && element.includes('construct') && element.includes('univ')) ||
                (element.includes('tyumen') && element.includes('architectural') && element.includes('univ'))) {
                if (arrAffils[k][0] != '[') {
                    arrAffils[k] = '[' + arrAffils[k]
                }
                let regexpBreckets = arrAffils[k].match(/\[(.*)\]/) || []
                //log(regexpBreckets)
                if (regexpBreckets[1]) {
                    let nameSplit = regexpBreckets[1].split('; ')
                    for (let m = 0; m < nameSplit.length; m++) {
                        let removeComms = nameSplit[m].replace(',', '')
                        let correctName = initials(removeComms)
                        arrOurAuthors.push(correctName)
                    }
                } else {
                    //console.log(authorWos[i]['eid'])
                }

            }
        }
        let ourAuthors = arrOurAuthors.join(', ')
        arrWosAuthors.push({
            eid: authorWos[i]['eid'],
            ourAuthors: ourAuthors
        })
    }

    //console.log(arrWosAuthors)

    await paperW.saveOurAuthors(arrWosAuthors);

    await client.set('statusWos', `45%`)

    let status = await client.get('statusWos')
    console.log(status)

    return true;
}

// Records connections between articles and authors
async function parserConnections() {
    let allOurAuthors = await paperW.findAllWithTrue(['eid', 'ourAuthors'])
    let allOurNames = await author.findAll(['id', 'shortName', 'name'])

    let arrConnection = []
    for (let i = 0; i < allOurAuthors.length; i++) {
        let nameAuthor = allOurAuthors[i].ourAuthors.split(', ');
        for (let k = 0; k < nameAuthor.length; k++) {
            let resultMiddleName = testMiddleName(nameAuthor[k]) == true;
            let findName = allOurNames.find(item => (resultMiddleName) ? item.name == nameAuthor[k] : item.shortName == nameAuthor[k])
            if (findName) {
                arrConnection.push({
                    paperId: allOurAuthors[i]['eid'],
                    authorId: findName['id']
                })
            } else {
                //log(allOurAuthors[i]['eid'])
            }    
        }
    }

    //console.log(arrConnection)
    await connection.save(arrConnection);

    await client.set('statusWos', `60%`)

    let status = await client.get('statusWos')
    console.log(status)
    
    return true;
}

module.exports = main;