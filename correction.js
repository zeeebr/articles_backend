const {PaperW} = require('./db');
const paperW = new PaperW();
const fs = require('fs').promises;

main();

async function main() {
    //await writeOneWos('WOS:000507401400010')
    await updateOneWos()
}

async function writeOneWos(eid) {
    let findWosSome = await paperW.findSome(eid)
    
    console.log(findWosSome)
    
    fs.writeFile('arr.json', JSON.stringify(findWosSome))
}

async function updateOneWos() {
    let data = await fs.readFile('arr.json', 'utf-8');
    
    console.log(JSON.parse(data))

    await paperW.update(JSON.parse(data))
}