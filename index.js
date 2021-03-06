// Reference the packages we require so that we can use them in creating the bot
var restify = require('restify');
var builder = require('botbuilder');
// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
// Listen for any activity on port 3978 of our local server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var num1;
var num2;
// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());
// =========================================================
// Bots Dialogs 
// =========================================================
// This is called the root dialog. It is the first point of entry for any message the bot receives
bot.dialog('/', [
    function(session) {
        session.beginDialog('/askName');
    },
    function(session, results) {
        session.send('Hello %s!', results.response);
        session.beginDialog('/setnum1');
    },
    function(session, results) {
        num1 = results.response;
        session.beginDialog('/setnum2');
    },
    function(session, results) {
        num2 = results.response;
        var total = Number(num1) + Number(num2);
        session.send('ผมรวมได้ = %d ไงละเก่งปะล่า ', total);
    }

]);

bot.dialog('/askName', [
    function(session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('/setnum1', [
    function(session) {
        builder.Prompts.text(session, 'Ok มาบวกเลขกัน !!\nใส่ตัวเลขแรกมาเลยจ้า');
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);
bot.dialog('/setnum2', [
    function(session) {
        builder.Prompts.text(session, 'ใส่เลขต่อไปมาเล้ยย !!');
    },
    function(session, results) {
        session.endDialogWithResult(results);
    }
]);