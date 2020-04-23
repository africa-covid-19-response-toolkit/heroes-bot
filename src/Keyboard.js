/**
 * 
 * 
 * Keyboard.js
 * 
 * 
 */

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const Strings = require("./Strings");



class Keyboard {
    constructor() {
    }


    // mainKeyboard() {
    //     return Markup.keyboard([
    //         [Strings.symptom, Strings.report_string],
    //         [Strings.statistics],
    //         [Strings.about]
    //     ])
    //     .oneTime()
    //     .resize()
    //     .extra();
    // }


    mainKeyboard() {
        return Markup.keyboard([
            [Strings.report_string]
        ])
        .oneTime()
        .resize()
        .extra();
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

    areaOfWorkKeyborad(state){
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

    ppeKeyborad(state){
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




}



module.exports.Keyboard = Keyboard;