const envalid = require('envalid');

const { str, port } = envalid
 
const main = envalid.cleanEnv(process.env, {
    DB_NAME:            str(),
    DB_USER:            str(),
    DB_PASSWORD:        str(),
    DB_HOST:            str(),
    PORT:               port()
})

module.exports = main;