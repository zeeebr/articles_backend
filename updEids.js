const {
    Eids
} = require('./models');
const {
    ExportS,
    NewEidS
} = require('./models/scopus');
const {
    ExportW,
    NewEidW
} = require('./models/wos');
const exportS = new ExportS();
const exportW = new ExportW();
const eids = new Eids();
const newEidS = new NewEidS();
const newEidW = new NewEidW();
const asyncRedis = require('async-redis');
const env = require('./env.js');
const client = asyncRedis.createClient({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT
});

client.on("error", function (err) {
    console.log("Error " + err);
});


async function main() {
    let newIdScopus = await newEidS.findAll(['eid']);

    await eids.save(newIdScopus);
    await newEidS.truncate();
    await exportS.truncate();
    await client.set('statusScopus', 'Ready for work!')


    let newIdWos = await newEidW.findAll(['eid']);
    
    await eids.save(newIdWos);
    await newEidW.truncate();
    await exportW.truncate();
    await client.set('statusWos', 'Ready for work!')
}

module.exports = main;