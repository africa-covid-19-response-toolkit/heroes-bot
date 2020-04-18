const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');

// get & parse .env file
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error
}


const creds = require(process.env.CLIENT_SECRET_FILE);
const  doc  = new GoogleSpreadsheet(process.env.GoogleSpreadsheetID);


module.exports.writeToSpreadsheet =  async function writeToSpreadsheet(data) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
  
    const sheet = doc.sheetsByIndex[0];

    await sheet.addRow({
        name: data.name,
        phone: data.phone,
        postName: data.postName,
        AreaofWork: data.AreaofWork,
        long: data.long,
        lat: data.lat,        
        symptoms: data.symptoms,
        PPEsUsed: data.PPEsUsed
    });
  
  }

// module.exports.writeToSpreadsheet = writeToSpreadsheet;