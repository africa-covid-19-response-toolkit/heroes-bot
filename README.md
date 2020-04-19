# Ethiopia COVID-19 Heroes Bot  
 This bot extends the starter kit from [here](https://github.com/Ethiopia-COVID19/covid-19-bot-starter-kit) 
 > Note:  Optionally, the data collected by the bot can be pushed to Google spreadsheet. To enable this functionality 

google-spreadsheet

 package is used ([more detail](https://www.npmjs.com/package/google-spreadsheet)). Take a look at the 

.env

 file to turn this on/off. You also need to set up a Google project & enable the sheets API ([more detail](https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication)) 

## Build Setup

bash
# copy .env.example file to .env and populate the required credentials
# populate the Telegram bot credentials in Secrets.js

# install dependecies 
$ npm install

# run app.js
$ node app.js

## Contribute
[Please see these guidelines](https://github.com/Ethiopia-COVID19/Covid19.ET/blob/master/CONTRIBUTING.md)


## Goal
1. Create a multi-channel (WhatsApp, Telegram, Viber, Messenger), multi-language bot that can push out information to the public through a REST API.  
2. Create a UI interface where folks can enter their message, select the available channels and push the message out.  
  
## Resources  
- [https://govinsider.asia/innovation/singapore-coronavirus-whatsapp-covid19-open-government-products-govtech](https://govinsider.asia/innovation/singapore-coronavirus-whatsapp-covid19-open-government-products-govtech)