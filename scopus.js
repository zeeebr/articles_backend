const parser = require('./parser');
const {PaperS, Author, Connection} = require('./db');
const {testMiddleName} = require('./utils');
const paperS = new PaperS();
const author = new Author();
const connection = new Connection();
const log = console.log;

async function main(path) {
    let ScopusData = await parser(path);
    let arrScopusData = [];
    for(let i = 0; i < ScopusData.length; i++) {
        arrScopusData.push( {
            eid: ScopusData[i]['EID'],
            type: ScopusData[i]['Тип документа'],
            topic: ScopusData[i]['Название'],
            doi: ScopusData[i]['DOI'],
            journal: ScopusData[i]['Название источника'],
            volume: ScopusData[i]['Том'],
            issue: ScopusData[i]['Выпуск '],
            pages: (ScopusData[i]['Страница начала']!='' && ScopusData[i]['Страница окончания']!='')? `${ScopusData[i]['Страница начала']}-${ScopusData[i]['Страница окончания']}`:ScopusData[i]['Статья №'],
            author: ScopusData[i]['﻿Авторы'],
            affil: ScopusData[i]['Авторы организаций'],
            year: ScopusData[i]['Год']
        });
    }

    await paperS.save(arrScopusData); // Writes all Scopus records from the CSV to the DB

    let authorScopus = await paperS.findAll(['eid', 'author', 'affil'])
    //console.log(authorScopus)
    let arrScopusAuthors= [];
    for(let i = 0; i < authorScopus.length; i++) {
        let arrAuthors = authorScopus[i].author.split(', ');
        let arrAffils = authorScopus[i].affil.split('; ');
        arrOurAuthors = [];
        for(let k = 0; k < arrAffils.length; k++) {
            let element = arrAffils[k].toLowerCase()
            if ((element.includes('tyumen') && element.includes('industrial') && element.includes('university')) 
                ||(element.includes('tyumen') && element.includes('industrial') && element.includes('univeristy'))
                || (element.includes('tumen') && element.includes('industrial') && element.includes('university')) 
                || (element.includes('tyumen') && element.includes('oil') && element.includes('gas'))
                || (element.includes('tymen') && element.includes('oil') && element.includes('gas'))
                || (element.includes('tumen') && element.includes('oil') && element.includes('gas'))
                || (element.includes('tiu'))
                || (element.includes('tsogu'))
                || (element.includes('tyumen') && element.includes('civil') && element.includes('university'))) {
                arrOurAuthors.push(arrAuthors[k])
            }
        }
        let ourAuthors = arrOurAuthors.join(', ')
        arrScopusAuthors.push( {
            eid: authorScopus[i]['eid'],
            ourAuthors: ourAuthors
        })
    }
    //console.log(arrScopusAuthors)

    await paperS.saveOurAuthors(arrScopusAuthors); // Parses organization employees

    let allOurAuthors = await paperS.findAll(['eid', 'ourAuthors'])
    
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

    //paperS.model.belongsToMany(author.model, { through: connection.model, foreignKey:'paperId' })
    //author.model.belongsToMany(paperS.model, { through: connection.model, foreignKey:'authorId' })

    await connection.save(arrConnection) // Records connections between articles and authors
}

module.exports = main;