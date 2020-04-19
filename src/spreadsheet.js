const { GoogleSpreadsheet } = require('google-spreadsheet');
const { promisify } = require('util');
const Strings = require("./Strings");

// get & parse .env file
const dotenv = require('dotenv').config();
const moment = require('moment');

if (dotenv.error) {
  throw dotenv.error
}


const creds = require(process.env.CLIENT_SECRET_FILE);
const  doc  = new GoogleSpreadsheet(process.env.GoogleSpreadsheetID);


//module.exports.writeToSpreadsheet = 

module.exports.writeToSpreadsheet = async function writeToSpreadsheet(data) {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo(); // loads document properties and worksheets
  
    const sheet = doc.sheetsByIndex[0];
    

  const row = {
    date: moment().format('DD-MM-YYYY'),
    name: data.name,
    phone: data.phone,
    postName: data.postName,
    long: data.long,
    lat: data.lat,
    Opd: data.AreaofWork.find(element => element == Strings.area_of_work_list[0])? true : false,
    Emergency: data.AreaofWork.find(element => element == Strings.area_of_work_list[1])? true : false,
    COVID_isolation_area: data.AreaofWork.find(element => element == Strings.area_of_work_list[2])? true : false,
    COVID_suspect_ward: data.AreaofWork.find(element => element == Strings.area_of_work_list[3])? true : false, 
    COVID_confirmed_ward: data.AreaofWork.find(element => element == Strings.area_of_work_list[4])? true : false,
    COVID_ICU: data.AreaofWork.find(element => element == Strings.area_of_work_list[5])? true : false,

    Fever_subjective_or_Objective: data.symptoms.find(element => element == Strings.symptoms_list[0])? true : false,
    Cough: data.symptoms.find(element => element == Strings.symptoms_list[1])? true : false, 
    Sore_throat: data.symptoms.find(element => element == Strings.symptoms_list[2])? true : false,
    Myalgia: data.symptoms.find(element => element == Strings.symptoms_list[3])? true : false,
    Vomiting: data.symptoms.find(element => element == Strings.symptoms_list[4])? true : false,
    Diarrhea: data.symptoms.find(element => element == Strings.symptoms_list[5])? true : false,
    Fatigue: data.symptoms.find(element => element == Strings.symptoms_list[6])? true : false,
    Shortness_of_breath: data.symptoms.find(element => element == Strings.symptoms_list[7])? true : false,
    
    Hazmat_Suit: data.PPEsUsed.find(element => element == Strings.ppe_list[0])? true : false, 
    Surgical_gown: data.PPEsUsed.find(element => element == Strings.ppe_list[1])? true : false,
    Apron: data.PPEsUsed.find(element => element == Strings.ppe_list[2])? true : false,
    Shoe_cover: data.PPEsUsed.find(element => element == Strings.ppe_list[3])? true : false,
    Surgical_mask: data.PPEsUsed.find(element => element == Strings.ppe_list[4])? true : false,
    N95: data.PPEsUsed.find(element => element == Strings.ppe_list[5])? true : false,
    Face_Shield: data.PPEsUsed.find(element => element == Strings.ppe_list[6])? true : false,
    Goggle: data.PPEsUsed.find(element => element == Strings.ppe_list[7])? true : false,

  }
  await sheet.addRow(row);
  
  
  }
//writeToSpreadsheet()