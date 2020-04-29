/**
 * 
 * 
 * Keyboard.js
 * 
 * 
 */

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const {admins} = require('./db');
const Strings = require("./Strings");



class Keyboard {
    constructor() {
    }



    mainKeyboard(ctx) {
        let username = ctx.update.callback_query?ctx.update.callback_query.from.username:ctx.message.from.username;
        console.log(admins.isAdmin(username)); 
        if(ctx != undefined && admins.isAdmin(username)){
            return Markup.keyboard([
                [Strings.report_string],
                [Strings.physicians_guide],
                [Strings.admins]
            ])
            .oneTime()
            .resize()
            .extra();
        }else{
            return Markup.keyboard([
                [Strings.report_string],
                [Strings.physicians_guide]
            ])
            .oneTime()
            .resize()
            .extra();
        }
    }

    genderKeyboard() {
        return Markup.keyboard([
            [Strings.male, Strings.female],
            [Strings.cancel]
        ])
        .oneTime()
        .resize()
        .extra();
    }


    cancelKeyboard() {
        return Markup.keyboard([
            [Strings.cancel]
        ])
        .oneTime()
        .resize()
        .extra();
    } 

    getphonenumberKeyboard() {
        return Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    markup.contactRequestButton(Strings.send_phone),
                    Strings.cancel
                ]);
        });

    }

    gpsKeyboard() {
        return Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    markup.locationRequestButton(Strings.send_gps),
                    Strings.cancel
                ]).oneTime();
        });
    }

    symptomKeyboard(state){
        return Extra.markup((markup) => {
            let safeState = state === undefined ? Array(Strings.symptoms_list.length).fill(false):state;

            let btns = Strings.symptoms_list.map(
                (label,index)=>{
                    return [markup.callbackButton(`${label} ${safeState[index]?"☑️":""}`, index.toString())];
                }
            );

           btns.push([
                markup.callbackButton(Strings.next,Strings.next),
                markup.callbackButton(Strings.cancel,Strings.cancel)
            ]);
            return markup
                .inlineKeyboard(btns)
                .resize();
        });
    }

    areaOfWorkKeyboard(state){
        return Extra.markup((markup) => {
            let safeState = state === undefined ? Array(Strings.area_of_work_list.length).fill(false):state;

            let btns = Strings.area_of_work_list.map(
                (label,index)=>{
                    return [markup.callbackButton(`${label} ${safeState[index]?"☑️":""}`, index.toString())];
                }
            );

            btns.push([
                markup.callbackButton(Strings.next,Strings.next),
                markup.callbackButton(Strings.cancel,Strings.cancel)
            ]);
            return markup
                .inlineKeyboard(btns)
                .resize();
        });
    }

    ppeKeyboard(state){
        return Extra.markup((markup) => {
            let safeState =( state === undefined) ? Array(Strings.ppe_list.length).fill(false):state;

            let btns = Strings.ppe_list.map(
                (label,index)=>{
                    return [markup.callbackButton(`${label} ${safeState[index]?"☑️":""}`, index.toString())];
                }
            );

            btns.push([
                markup.callbackButton(Strings.next,Strings.next),
                markup.callbackButton(Strings.cancel,Strings.cancel)
            ]);
            return markup
                .inlineKeyboard(btns)
                .resize();
        });
    }

    professionKeyboard(){
        return Extra.markup((markup) => {
            let btns = Strings.profession_list.map(
                (label,index)=>{
                    return [markup.callbackButton(`${label}`, index.toString())];
                }
            );

            btns.push([
                markup.callbackButton(Strings.cancel,Strings.cancel)
            ]);
            return markup
                .inlineKeyboard(btns)
                .resize();
        });
    }
    manageAdminKeyboard(cxt){
        return Extra.markup((markup) => {
            let admin_list = admins.find();
            let btns = admin_list.map(
                (label,index)=>{
                    return [markup.callbackButton(`${label.name} ${label.telegramHandel}`, "@"+label.telegramHandel), markup.callbackButton("🗑","@"+label.telegramHandel)];
                }
            );

            btns.push([
                markup.callbackButton(Strings.addNewAdmin,Strings.addNewAdmin),
                markup.callbackButton(Strings.cancel,Strings.cancel)
            ]);
            return markup
                .inlineKeyboard(btns)
                .resize();
        });
    }




}



module.exports.Keyboard = Keyboard;