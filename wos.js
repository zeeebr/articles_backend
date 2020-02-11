const parser = require('./parser');
const {PaperW, Author, Connection} = require('./db');
const {testMiddleName, initials} = require('./utils');
const paperW = new PaperW();
const author = new Author();
const connection = new Connection();
const log = console.log;
const fs = require('fs').promises;

async function main(path) {
    let WosData = await parser(path, {
        //headers: false,
        separator: '\t',
        quote: ""
    });
    let arrWosData = [];
    for(let i = 0; i < WosData.length; i++) {
        arrWosData.push( {
            eid: WosData[i]['61'],
            type: WosData[i]['13'],
            topic: WosData[i]['8'],
            doi: WosData[i]['54'],
            journal: WosData[i]['9'],
            volume: WosData[i]['45'],
            issue: WosData[i]['46'],
            pages: (WosData[i]['51']!='' && WosData[i]['52']!='')? `${WosData[i]['51']}-${WosData[i]['52']}`:WosData[i]['53'],
            author: WosData[i]['5'],
            affil: WosData[i]['22'],
            year: WosData[i]['44']
        });
    }
    
    await paperW.save(arrWosData); // Writes all WoS records from the CSV to the DB

    let authorWos = await paperW.findAll(['eid', 'affil'])
    //console.log(authorWos)
    let arrWosAuthors= [];
    for(let i = 0; i < authorWos.length; i++) {
        let arrAffils = authorWos[i].affil.split('; [');
        arrOurAuthors = [];
        for(let k = 0; k < arrAffils.length; k++) {
          let element = arrAffils[k].toLowerCase()
            if ((element.includes('tyumen') && element.includes('ind') && element.includes('univ'))
            || (element.includes('tiumen') && element.includes('ind') && element.includes('univ'))
            || (element.includes('tyumen') && element.includes('oil') && element.includes('gas'))
            || (element.includes('tumen') && element.includes('oil') && element.includes('gas'))
            || (element.includes('tyumen') && element.includes('petr') && element.includes('univ'))
            || (element.includes('tyumen') && element.includes('ind') && element.includes('inst'))
            || (element.includes('iut'))
            || (element.includes('tiu'))
            || (element.includes('tyumen') && element.includes('civil') && element.includes('univ'))
            || (element.includes('tyumen') && element.includes('construct') && element.includes('univ'))
            || (element.includes('tyumen') && element.includes('architectural') && element.includes('univ')))
            {
                if(arrAffils[k][0] != '[') {
                    arrAffils[k] = '[' + arrAffils[k]
                }
                let regexpBreckets = arrAffils[k].match(/\[(.*)\]/) || []
                //log(regexpBreckets)
                if(regexpBreckets[1]) {
                    let nameSplit = regexpBreckets[1].split('; ')
                    for(let m = 0; m < nameSplit.length; m++) {
                        let removeComms = nameSplit[m].replace(',', '')
                        let correctName = initials(removeComms)
                        arrOurAuthors.push(correctName)
                    }
                } else {
                    console.log(authorWos[i]['eid'])
                }
                          
            }
        }
        let ourAuthors = arrOurAuthors.join(', ')
        arrWosAuthors.push( {
            eid: authorWos[i]['eid'],
            ourAuthors: ourAuthors
        })
    }

    //log(arrWosAuthors)

    await paperW.saveOurAuthors(arrWosAuthors); // Parses organization employees

    let allOurAuthors = await paperW.findAll(['eid', 'ourAuthors'])
    
    let allOurNames = await author.findAll(['id', 'name'])
    
    let arrConnection = []
    for(let i = 0; i < allOurAuthors.length; i++) {
        let nameAuthor = allOurAuthors[i].ourAuthors.split(', ');
        for(let k = 0; k < nameAuthor.length; k++) {
            if(testMiddleName(nameAuthor[k]) == true) {
                let findName = allOurNames.find(item => item.name == nameAuthor[k])
                if(findName) {
                    arrConnection.push({
                        paperId: allOurAuthors[i]['eid'],
                        authorId: findName['id']
                    })
                } else {
                    let regexpTest = /(.*)\s(.\.)(.\.)/
                    let findName = allOurNames.find(item => item.name == nameAuthor[k].replace(regexpTest, '$1 $2'))
                    if(findName) {
                        arrConnection.push({
                            paperId: allOurAuthors[i]['eid'],
                            authorId: findName['id']
                        })
                    }
                }
            } else {
                //log(allOurAuthors[i]['eid'])
            }
        }
    }
    //log(arrConnection)
    //fs.writeFile('arr.txt', JSON.stringify(arrConnection))

    //let findWosSome = await paperW.findSome('WOS:000452093000014')
    //log(findWosSome)

    await connection.save(arrConnection) // Records connections between articles and authors
}

module.exports = main;