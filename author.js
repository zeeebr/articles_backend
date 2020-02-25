const parser = require('./parser');
const translit = require('./translit');
const {
    Author
} = require('./db');
const {
    testMiddleName
} = require('./utils');
const author = new Author();
const log = console.log;
const fs = require('fs').promises;


async function main(path) {
    let authorsData = await parser(path);
    //console.log(authorsData)

    for (let i = 0; i < authorsData.length; i++) {
        authorsData[i]['frezee'] = false;
    }

    //console.log(authorsData)

    await author.save(authorsData); // Writes all Authors from the CSV to the DB

    let allAlisas = await author.findAllFrezeeFalse(['alias'])

    for (let i = 0; i < allAlisas.length; i++) {
        allAlisas[i]['name'] = translit(allAlisas[i]['alias'])
    }
    //fs.writeFile('arr.txt', JSON.stringify(arrAlias))

    await author.saveNames(allAlisas) // Translates authors from Russian

    let allNames = await author.findAll(['name', 'alias'])

    let arrShortNames = [];
    for (let i = 0; i < allNames.length; i++) {
        let regexpTest = /(.*)\s(.\.)(.\.)/
        //log(regexpTest.test(allNames[i]['name']))
        if (regexpTest.test(allNames[i]['name'])) {
            arrShortNames.push({
                shortName: allNames[i]['name'].replace(regexpTest, '$1 $2'),
                alias: allNames[i]['alias']
            })
        } else {
            //log(allNames[i]['name'])
        }
    }

    await author.saveShortNames(arrShortNames)
    //log(arrShortNames)
    return;
}

module.exports = main;