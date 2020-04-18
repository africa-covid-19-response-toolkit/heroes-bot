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
           

            // enter a scene
            ctx.flow.enter("reportScene", ctx.flow.state);
        
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
            //  new StatHandler().fetchData((data) => {
            //      ctx.reply(data);
            //  });
             
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
            // enter a scene
            ctx.reply(Strings.greet);
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
             let msg = "";
             // msg = msg? msg : "get the # ";

            if(ctx.message.contact!=undefined){
                msg = ctx.message.contact.phone_number.split(" ").reduce((t,s)=>t+s);
                msg = "0"+msg.substr(msg.length-9)//remove spaces and country code
            }else{
                msg = ctx.message.text;
            }



             let phoneRegex = /^09\d{8}$/; // match 09xxxxxxxx
            
             if (msg == "" || msg == undefined || !phoneRegex.test(msg)) {
                 ctx.reply(Strings.invalidInput);
                console.log(msg);
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

        getGPS.on("message", (ctx) => {
            let loc = ctx.message.location?ctx.message.location:ctx.message.text;

            if (loc != undefined && loc instanceof Object) {
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
             ctx.reply(Strings.area_of_work, this.keyboard.areaOfWorkKeyborad())
         });
                  
         getareaofwork.leave((ctx) => {});

         getareaofwork.action(/[0-9]+/,(ctx)=>{
            if(ctx.flow.state.areaOfWork===undefined){
                ctx.flow.state.areaOfWork=Array(Strings.area_of_work_list.length).fill(false);
             }
             ctx.flow.state.areaOfWork[ctx.match[0]]=!ctx.flow.state.areaOfWork[ctx.match[0]];
             ctx.editMessageText(Strings.area_of_work,this.keyboard.areaOfWorkKeyborad(ctx.flow.state.areaOfWork));
         });

         getareaofwork.action(Strings.next,(ctx)=>{
            ctx.flow.enter("symptomsScene", ctx.flow.state);
         });

         getareaofwork.action(Strings.cancel,(ctx)=>{
            ctx.flow.leave();            
            ctx.reply("Canceled!", this.keyboard.mainKeyboard());
         })

         return getareaofwork;
     }


    symptomsScene() {
        const symptomsScene = new Scene("symptomsScene");
        symptomsScene.enter((ctx) => {
            ctx.reply(Strings.symptom_header, this.keyboard.symptomKeyboard());
        });

       
        symptomsScene.action(/[0-9]+/,(ctx)=>{
            
            if(ctx.flow.state.symptom===undefined){
               ctx.flow.state.symptom=Array(Strings.symptoms_list.length).fill(false);
            }
            ctx.flow.state.symptom[ctx.match[0]]=!ctx.flow.state.symptom[ctx.match[0]];
            ctx.editMessageText(Strings.symptom_header,this.keyboard.symptomKeyboard(ctx.flow.state.symptom));
        });
        
        symptomsScene.action(Strings.next,(ctx)=>{
           ctx.flow.enter("ppesUsedScene", ctx.flow.state);
        });

        symptomsScene.action(Strings.cancel,(ctx)=>{
           ctx.flow.leave();            
           ctx.reply("Canceled!", this.keyboard.mainKeyboard());
        })

        symptomsScene.leave((ctx) => {});

        return symptomsScene;
    }


    ppesUsedScene() {
        const ppesUsedScene = new Scene("ppesUsedScene");
        ppesUsedScene.enter((ctx) => {
            ctx.reply(Strings.ppe_used, this.keyboard.ppeKeyborad())
        });

        ppesUsedScene.action(/[0-9]+/,(ctx)=>{
            
            if(ctx.flow.state.ppe===undefined){
               ctx.flow.state.ppe=Array(Strings.ppe_list.length).fill(false);
            }
            ctx.flow.state.ppe[ctx.match[0]]=!ctx.flow.state.ppe[ctx.match[0]];
            return ctx.editMessageText("ppe used",this.keyboard.ppeKeyborad(ctx.flow.state.ppe));
        });
        
        ppesUsedScene.action(Strings.next,(ctx)=>{
           ctx.flow.enter("finScene", ctx.flow.state);
        });

        ppesUsedScene.action(Strings.cancel,(ctx)=>{
           ctx.flow.leave();            
           ctx.reply("Canceled!", this.keyboard.mainKeyboard());
        })
        

        ppesUsedScene.leave((ctx) => {});

        return ppesUsedScene;
    }


     finScene() {
        const fin = new Scene("finScene");

        fin.enter((ctx) => {

        let data = {
            name: ctx.flow.state.full_name,
            phone: ctx.flow.state.phoneNumber,
            postName: Strings.area_of_work_list.filter((area,i)=>{return ctx.flow.state.areaOfWork[i]}),
            AreaofWork: ctx.flow.state.work_area,
            long: ctx.flow.state.long,
            lat: ctx.flow.state.lat,
            symptoms: Strings.symptoms_list.filter((area,i)=>{return ctx.flow.state.symptom[i]}),
            PPEsUsed: Strings.ppe_list.filter((area,i)=>{return ctx.flow.state.ppe[i]})
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