let parser = require('./parser')
let {PaperS, PaperW} = require('./db')

main()

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

    let authorScopus = await paperS.findAllAuthors()
    //console.log(authorScopus)
    let arrScopusAuthors= [];
    for(let i = 0; i < authorScopus.length; i++) {
        let arrAuthors = authorScopus[i].author.split(', ');
        let arrAffils = authorScopus[i].affil.split('; ');
        arrOurAuthors = [];
        for(let k = 0; k < arrAffils.length; k++) {
            let element = arrAffils[k]
            if (element.includes('Tyumen') && element.includes('Industrial') && element.includes('University')) {
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

    paperS.saveOurAuthors(arrScopusAuthors); // Записывает "наших" авторов в БД в новый столбец

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
}