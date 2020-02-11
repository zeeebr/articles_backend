const parser = require('./parser');
const translit = require('./translit');
const {Author} = require('./db');
const author = new Author();


async function main(path) {
    let AuthorsData = await parser(path);
    //console.log(AuthorsData)
    
    await author.save(AuthorsData); // Writes all Authors from the CSV to the DB

    let allAlisas = await author.findAll(['alias'])

    let arrAlias = [];
    for(let i = 0; i < allAlisas.length; i++) {
        arrAlias.push ( {
            name: translit(allAlisas[i]['alias']),
            alias: allAlisas[i]['alias']
        })
    }
    //console.log(arrAlias)
    
    await author.saveNames(arrAlias) // Translates authors from Russian
}

module.exports = main;