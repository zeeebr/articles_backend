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
    let paper = new PaperS();
    paper.save(arrScopusData)
    console.log(paper)
    //await paper.save()
    //let paper = new PaperS(arrScopusData);
    //console.log(arrScopusData)
    let WosData = await parser('data/savedrecs.csv', {
        //headers: false,
        separator: '\t',
        quote: ""
    });
    for(let i = 0; i < WosData.length; i++) {
        let paper = new PaperW(WosData[i])
        //console.log(paper.data)
        //await paper.save();
    }
}

// на выходе из цикла надо получить массив объектов, отформатированных и пригодных для записи в бд
