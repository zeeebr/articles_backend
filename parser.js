const csv = require('neat-csv');
const fs = require('fs').promises;

async function main(path, params = {}) {
  let data = await fs.readFile(path);
  let parsedData = await csv(data, params);
  //console.log(parsedData)
  return parsedData
}

module.exports = main;