const parser = require('./parser');
const translit = require('./translit');
const {Author} = require('./db');
const {testMiddleName} = require('./utils');
const author = new Author();
const log = console.log;
const fs = require('fs').promises;


async function main(path) {
    let AuthorsData = await parser(path);
    //console.log(AuthorsData)
    let arrAuthor = [];
    for(let i = 0; i < AuthorsData.length; i++) {
        arrAuthor.push( {
            alias: AuthorsData[i]['alias'],
            inst: AuthorsData[i]['inst'],
            cathedra: AuthorsData[i]['cathedra'],
            frezee: false
        })
    }
    //console.log(arrAuthor)
    
    await author.save(arrAuthor); // Writes all Authors from the CSV to the DB
    
    let allAlisas = await author.findAllFrezeeFalse(['alias'])

    let arrAlias = [];
    for(let i = 0; i < allAlisas.length; i++) {
        arrAlias.push ( {
            name: translit(allAlisas[i]['alias']),
            alias: allAlisas[i]['alias']
        })
    }
    //console.log(arrAlias)
    //fs.writeFile('arr.txt', JSON.stringify(arrAlias))
    
    await author.saveNames(arrAlias) // Translates authors from Russian

    let allNames = await author.findAll(['name','alias'])

    let arrShortNames = [];
    for(let i = 0; i < allNames.length; i++) {
        let regexpTest = /(.*)\s(.\.)(.\.)/
        //log(regexpTest.test(allNames[i]['name']))
        if(regexpTest.test(allNames[i]['name'])) {
            arrShortNames.push( {
                shortName: allNames[i]['name'].replace(regexpTest, '$1 $2'),
                alias: allNames[i]['alias']
            })
        } else {
            //log(allNames[i]['name'])
        }
    }

    await author.saveShortNames(arrShortNames)
    //log(arrShortNames)
}

module.exports = main;