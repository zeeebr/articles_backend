let parser = require('./parser')
let {PaperS, PaperW, Author} = require('./db')
let translit = require('./translit')

main()

let log = console.log;

async function main() {
    let ScopusData = await parser('data/scopus.csv');
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
    let paperS = new PaperS();

    //paperS.save(arrScopusData); // записывает все записи Scopus из csv в БД

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

    //paperS.saveOurAuthors(arrScopusAuthors); // Записывает "наших" авторов в БД в новый столбец

    let authorScopusTranslit = await paperS.findAll(['eid', 'ourAuthors'])
    //console.log(authorScopusTranslit)

    let WosData = await parser('data/savedrecs.csv', {
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
    let paperW = new PaperW();

    //paperW.save(arrWosData); // записывает все записи  WoS из csv в БД

    let authorWos = await paperW.findAll(['eid', 'affil'])
    //console.log(authorWos)
    let arrWosAuthors= [];
    for(let i = 0; i < authorWos.length; i++) {
        let arrAffils = authorWos[i].affil.split('; [');
        //log(arrAffils)
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
            || (element.includes('tyumen') && element.includes('architectural') && element.includes('univ'))
            ) {
                arrOurAuthors.push(arrAffils[k])
            }
        }
        //log(arrOurAuthors)
        let ourAuthors = arrOurAuthors.join()
        if(ourAuthors[0] === '')
            ourAuthors = '[' + ourAuthors + ']'
        if(ourAuthors[0] != '[') {
            ourAuthors = '[' + ourAuthors
        }
        let regexp = ourAuthors.match(/\[([^\}]*)\]/) || []
        ourAuthors = regexp[1]
        //log(ourAuthors)
        arrWosAuthors.push( {
            eid: authorWos[i]['eid'],
            ourAuthors: ourAuthors
        })
    }

    //console.log(arrWosAuthors)

    paperW.saveOurAuthors(arrWosAuthors); // Записывает "наших" авторов WoS в БД в новый столбец

    let AuthorsData = await parser('data/authors.csv');
    //console.log(AuthorsData)
    
    let author = new Author;
    
    //author.save(AuthorsData);

    let allAlisas = await author.findAll(['id', 'alias'])
    let arrAlias = [];
    for(let i = 0; i < allAlisas.length; i++) {
        arrAlias.push ( {
            id: allAlisas[i]['id'],
            name: translit(allAlisas[i]['alias'])
        })
    }
    //console.log(arrAlias)
    //author.saveNames(arrAlias) // транслителирует авторов с русского
 
    /*let allOurAuthors = await paperS.findAll(['eid', 'ourAuthors'])
    let ourNames = await author.findAll(['id', 'name'])
    for(let i = 0; i < allOurAuthors.length; i++) {
        let name = allOurAuthors[i].ourAuthors.split(',');
            for(let k = 0; k < name.length; i++) {
                let like = name[i]
                 if (like ===) {
                    id[findindex(name)] бьютифу поставить or simple find
                 }
            }
        //log(name)
    }*/
  //  console.log(allOurAuthors)
}