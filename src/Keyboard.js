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
                ]);
        });
    }

}



module.exports.Keyboard = Keyboard;