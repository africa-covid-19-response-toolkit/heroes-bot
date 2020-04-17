/**
 * 
 * 
 * Scenes.js
 * 
 * 
 */

const TelegrafFlow = require('telegraf-flow');
const { Scene } = TelegrafFlow;
const Extra = require('telegraf/extra');

const util = require('util')


const { Keyboard } = require("./Keyboard");
const { Log } = require("./Log");
const { StatHandler } = require("./StatHandler");
const Strings = require("./Strings");
const Spreadsheet = require("./spreadsheet");
const helper = require("./helper")
const yn = require('yn');

// get & parse .env file
const dotenv = require('dotenv').config();

if (dotenv.error) {
  throw dotenv.error
}



 class Scenes {
     constructor() {
         this.keyboard = new Keyboard();
     }

     collectDataScene() {
        const data = new Scene("collectDataScene");
        data.enter((ctx) => {
            ctx.reply("Welcom & Thank you for your service");

            // enter a scene
            ctx.flow.enter("getnameScene", ctx.flow.state);
        
           // Log
           new Log(ctx).log("Clicked on Report button!");
        });

        data.leave((ctx) => {});

        return data;
        // ctx.flow.enter("getnameScene", ctx.flow.state);
     }

     greeterScene() {
         const greeter = new Scene("greeterScene");

         greeter.enter((ctx) => {
             let fname = (ctx.from.first_name != undefined) ? ctx.from.first_name : ctx.from.username;

             ctx.reply(`Hello ${fname}`, this.keyboard.mainKeyboard());

             // state
             new StatHandler().fetchData((data) => {
                 ctx.reply(data);
             });
             
             // log
             new Log(ctx).log("Started the bot!");

             // leave
             ctx.flow.leave();
         });
         greeter.leave((ctx) => {});


         return greeter;
     }

     statScene() {
         let stat = new Scene("statScene");


         stat.enter((ctx) => {
             new StatHandler().fetchData((data) => {
                 ctx.reply(data);
                
                 // Log
                 new Log(ctx).log("Clicked on Stat button!");

                 // leave
                 ctx.flow.leave();
            });

         });

         stat.leave((ctx) => {});

         return stat;
     }


     symptomScene() {
         const symptom = new Scene("symptomScene");

         symptom.enter((ctx) => {
             ctx.replyWithPhoto(
                 "https://www.cdc.gov/coronavirus/2019-ncov/images/symptoms-shortness-breath.jpg",
                 {caption: Strings.symptom_string_breath}
             );

             ctx.replyWithPhoto(
                 "https://www.cdc.gov/coronavirus/2019-ncov/images/symptoms-fever.jpg",
                 {caption: Strings.symptom_string_fever}
             );

             ctx.replyWithPhoto(
                 "https://www.cdc.gov/coronavirus/2019-ncov/images/symptoms-cough.jpg",
                 {caption: Strings.symptom_string_cough}
             );

             // Log
             new Log(ctx).log("Clicked on the symptom button!");
         });


         symptom.leave((ctx) => {});

         return symptom;
     }


     reportScene() {
         const report = new Scene("reportScene");

         report.enter((ctx) => {
             ctx.reply("Welcome and Thank yor for your service");

             // enter a scene
             ctx.flow.enter("getnameScene", ctx.flow.state);
         
            // Log
            new Log(ctx).log("Clicked on Report button!");
         });

         report.leave((ctx) => {});

         return report;
     }


     aboutScene() {
         const about = new Scene("aboutScene");

         about.enter((ctx) => {
             ctx.reply("about");


             // Log
             new Log(ctx).log("Clicked on about button!");


             // leave
             ctx.flow.leave();
         });


         about.leave((ctx) => {});


         return about;
     }


     // data collection ps: the collector is a grate name
     getNameScene() {
         const getname = new Scene("getnameScene");
         getname.enter((ctx) => {
             ctx.reply(Strings.getName, this.keyboard.cancelKeyboard())
         });


         getname.on("message", (ctx) => {
             let msg = ctx.message.text;

             if (msg == "" || msg == undefined) {
                 ctx.reply(Strings.invalidInput);

                 ctx.flow.enter("getnameScene", ctx.flow.state);
             } else {
                // save to state
                ctx.flow.state.full_name = msg;

                // enter scene
                ctx.flow.enter("getphoneScene", ctx.flow.state);
             }

            
         });

         getname.leave((ctx) => {});

         return getname;
     }


     getPhone() {
         const getphone = new Scene("getphoneScene");

         getphone.enter((ctx) => {
             ctx.reply(Strings.getphone, this.keyboard.getphonenumberKeyboard());
         });

         getphone.on("message", (ctx) => {
             let msg = ctx.message.contact.phone_number;
             // msg = msg? msg : "get the # ";
             
             // console.log(util.inspect(ctx.message, {showHidden: false, depth: null}))

             if (msg == "" || msg == undefined ) {
                 ctx.reply(Strings.invalidInput);

                 ctx.flow.enter("getphoneScene", ctx.flow.state);
             } else {
                // save to state
                ctx.flow.state.phoneNumber = msg;

                // enter flow
                ctx.flow.enter("getHospitalName", ctx.flow.state);
             }

         });

         getphone.leave((ctx) => {});


         return getphone;
     }

     getHospitalName() {
        const gethospital = new Scene("getHospitalName");

        gethospital.enter((ctx) => {
            ctx.reply(Strings.hospitalname, this.keyboard.cancelKeyboard());
        });

        gethospital.on("message", (ctx) => {
            let msg = ctx.message.text;
            console.log(msg);

            if (msg == "" || msg == undefined) {
                ctx.reply(Strings.invalidInput);

                ctx.flow.enter("getHospitalName", ctx.flow.state);
            } else {
               // save to state
               ctx.flow.state.hospitalpostname = msg;

               // enter flow
               ctx.flow.enter("gpsScene", ctx.flow.state);
            }


        });

        gethospital.leave((ctx) => {});


        return gethospital;
    }


     getAge() {
        const getage = new Scene("getageScene");

        getage.enter((ctx) => {
            ctx.reply(Strings.getAge);
        });

        getage.on("message", (ctx) => {
            let msg = ctx.message.text;

            if (msg == "" || msg == undefined) {
                ctx.reply(Strings.invalidInput);

                ctx.flow.enter("getageScene", ctx.flow.state);
            } else {
                // save to state
                ctx.flow.state.person_age = msg;

                // enter flow
                ctx.flow.enter("getGender", ctx.flow.state);
            }

            

        });

        getage.leave((ctx) => {});


        return getage;
     }


     getGender() {
        const gender = new Scene("getGender");

        gender.enter((ctx) => {
            ctx.reply(Strings.getGender, this.keyboard.genderKeyboard());
        });

        gender.on("message", (ctx) => {
            let msg = ctx.message.text;

            if (msg == "" || msg == undefined) {
                ctx.reply(Strings.invalidInput);

                ctx.flow.enter("getGender", ctx.flow.state);
            } else {
                // save to state
               
                    ctx.flow.state.gender = msg;

                    // enter flow
                    ctx.flow.enter("getlocationbynameScene", ctx.flow.state);
            }


        });

        gender.leave((ctx) => {});


        return gender;
     }


     getLocation() {
        const getLocation = new Scene("getlocationbynameScene");

        getLocation.enter((ctx) => {
            ctx.reply(Strings.getLocation, this.keyboard.cancelKeyboard());
        });

        getLocation.on("message", (ctx) => {
            let msg = ctx.message.text;

            if (msg == "" || msg == undefined) {
                ctx.reply(Strings.invalidInput);

                ctx.flow.enter("getlocationbynameScene", ctx.flow.state);
            } else {

                // save to state
                ctx.flow.state.location_name = msg;

                // enter flow
                ctx.flow.enter("gpsScene", ctx.flow.state);
            }

        });

        getLocation.leave((ctx) => {});


        return getLocation;
     }

     getGPSCoord() {
        const getGPS = new Scene("gpsScene");

        getGPS.enter((ctx) => {
            ctx.reply(Strings.getGPS, this.keyboard.gpsKeyboard());
        });

        getGPS.on("location", (ctx) => {
            let loc = ctx.message.location;

            if (loc != undefined) {
                // save to state

                ctx.flow.state.lat = loc.latitude;
                ctx.flow.state.long = loc.longitude;

                ctx.flow.enter("getAreaofWorksScene", ctx.flow.state);
            } else {
                ctx.reply(Strings.invalidInput);
                
                ctx.flow.enter("gpsScene", ctx.flow.state);
            }
        });

        getGPS.leave((ctx) => {});


        return getGPS;
     }

     
     getAreaofWorksScene() {
         const getareaofwork = new Scene("getAreaofWorksScene");
         getareaofwork.enter((ctx) => {
             ctx.reply(Strings.area_of_work, this.keyboard.cancelKeyboard())
         });

         getareaofwork.on("message", (ctx) => {
             let msg = ctx.message.text;
             
             if (msg == "" || msg == undefined) {
                 //ctx.reply(Strings.invalidInput); 
                 ctx.reply(Strings.choiceerror);

                 ctx.flow.enter("getAreaofWorksScene", ctx.flow.state);
             } 
             
             if (msg == "1" || msg == "2" || msg == "3" || msg == "4" || msg == "5" || msg == "6"){
                ctx.flow.state.work_area = msg;
                ctx.flow.enter("symptomsScene", ctx.flow.state);
             }else {
                ctx.reply(Strings.choiceerror);
                ctx.flow.enter("getAreaofWorksScene", ctx.flow.state);
             }            
         });

         getareaofwork.leave((ctx) => {});

         return getareaofwork;
     }


    symptomsScene() {
        const symptomsScene = new Scene("symptomsScene");
        symptomsScene.enter((ctx) => {
            ctx.reply(Strings.symptoms_list, this.keyboard.cancelKeyboard())
        });

        symptomsScene.on("message", (ctx) => {
            let msg = ctx.message.text;
            
            if (msg == "" || msg == undefined) {
                //ctx.reply(Strings.invalidInput); 
                ctx.reply(Strings.choiceerror2);
                ctx.flow.enter("symptomsScene", ctx.flow.state);
            } 
            
            if (msg == "1" || msg == "2" || msg == "3" || msg == "4" || msg == "5" || msg == "6" || msg == "7" || msg == "8"){
               ctx.flow.state.symptom = msg;
               ctx.flow.enter("ppesUsedScene", ctx.flow.state);
            }else {
               ctx.reply(Strings.choiceerror);
               ctx.flow.enter("symptomsScene", ctx.flow.state);
            }            
        });

        symptomsScene.leave((ctx) => {});

        return symptomsScene;
    }


    ppesUsedScene() {
        const ppesUsedScene = new Scene("ppesUsedScene");
        ppesUsedScene.enter((ctx) => {
            ctx.reply(Strings.ppe_used, this.keyboard.cancelKeyboard())
        });

        ppesUsedScene.on("message", (ctx) => {
            let msg = ctx.message.text;
            
            if (msg == "" || msg == undefined) {
                //ctx.reply(Strings.invalidInput); 
                ctx.reply(Strings.choiceerror2);
                ctx.flow.enter("ppesUsedScene", ctx.flow.state);
            } 
            
            if (msg == "1" || msg == "2" || msg == "3" || msg == "4" || msg == "5" || msg == "6" || msg == "7" || msg == "8"){
               ctx.flow.state.ppe = msg;
               ctx.flow.enter("finScene", ctx.flow.state);
            }else {
               ctx.reply(Strings.choiceerror);
               ctx.flow.enter("ppesUsedScene", ctx.flow.state);
            }            
        });

        ppesUsedScene.leave((ctx) => {});

        return ppesUsedScene;
    }


     finScene() {
        const fin = new Scene("finScene");

        fin.enter((ctx) => {
            let data = {
                name: ctx.flow.state.full_name,
                phone: ctx.flow.state.phoneNumber,
                postName: ctx.flow.state.hospitalpostname,
                AreaofWork: ctx.flow.state.work_area,
                long: ctx.flow.state.long,
                lat: ctx.flow.state.lat,
                symptoms: ctx.flow.state.symptom,
                PPEsUsed: ctx.flow.state.ppe
            }

        // if   PUSH_TO_SPREADSHEET var is true, push to a google excel sheet  
        if(yn(process.env.PUSH_TO_SPREADSHEET)){
            console.log("Writing to spreadsheet ...");    
            Spreadsheet.writeToSpreadsheet(data);
            console.log("Writing to spreadsheet Done");
        }
        
            ctx.reply("Name: " + data.name + "\nPhone: " + data.phone +   "\nHospital post name: " + data.postName +   "\nArea of Work: " + data.AreaofWork + "\nLongitude: " + data.long + "\nLatitude: " + data.lat + "\nSymptom: " + data.symptoms + "\nPPEsUsed: " + data.PPEsUsed);

            // leave
            ctx.flow.leave();

        });


        fin.leave((ctx) => {
            ctx.reply(Strings.thank, this.keyboard.mainKeyboard());
        });


        return fin;
     }




     


 }



 module.exports.Scenes = Scenes;