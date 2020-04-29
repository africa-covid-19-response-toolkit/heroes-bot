const low = require("lowdb");
const FileSync = require('lowdb/adapters/FileSync');
const path = require("path");

// get & parse .env file
const dotenv = require("dotenv").config();

if (dotenv.error) {
  throw dotenv.error;
}
let dbFile = path.resolve(__dirname, "./dataStore.json");
let admins ={};
let guide ={};
const defaultSchema = {admins:[],guide:{}}; //{admin: { name: name, telegramHandel: @handel  },guide:url}

const adapter =  new FileSync(dbFile);
const db = new low(adapter);

db.defaults(defaultSchema).write();

admins.insert = (obj)=>{
    db.get('admins').push(obj).write();
}

admins.find = (handel)=>db.get('admins').value();

admins.delete = (handel) => {
  db.get('admins').remove({ telegramHandel: handel }).write();
};

admins.getAdmin = (handel) => db.get('admins').filter({telegramHandel:handel}).value();
admins.isAdmin = (handel) => admins.getAdmin(handel).length>0;


if(db.get('admins').value().length == 0){
    try {
        JSON.parse(process.env.INIT_ADMINS).forEach((el)=>{admins.insert(el);});
    } catch (e) {
      console.log("initial admin list is not correct. please edit INIT_ADMINS in .env file",e);
    }
}

guide.setURL = (url) => db.set('guide.url',url).write();
guide.getGuide = (url) => db.get('guide.url').value();

module.exports.db = db;
module.exports.admins = admins;
module.exports.guide = guide;
