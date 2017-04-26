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
    }
]);

bot.dialog('/askName', [
    // function(session) {
    //     builder.Prompts.text(session, 'Hi! What is your name?');
    // },
    function(session) {
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function(session, results) {
        session.userData.profile = results.profile;
        session.send('Hello %s!', session.userData.profile.name);
    }
]);

bot.dialog('/ensureProfile', [
    function(session, args, next) {
        session.dialogData.profile = args || {};
        if (!args.profile.name) {
            builder.Prompts.text(session, "Hi! What is your name?");
        } else {
            next();
        }
    },
    function(session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!args.profile.email) {
            builder.Prompts.text(session, "What's your email address?");
        } else {
            next();
        }
    },
    function(session, results) {
        if (results.response) {
            session.dialogData.profile.email = results.response;
        }
        session.endDialogWithResults({ repsonse: session.dialogData.profile })
    }
]);