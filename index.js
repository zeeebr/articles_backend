let parser = require('./parser')
let {PaperS, PaperW} = require('./db')

main()

async function main() {
    let ScopusData = await parser('data/scopus.csv');
    let arrScopusData = [];
    for(let i = 0; i < ScopusData.length; i++) {
        arrScopusData.push(ScopusData[i]);
    }
    let paper = new PaperS(arrScopusData)
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
