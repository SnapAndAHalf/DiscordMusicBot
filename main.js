const Discord = require('discord.js');
const myIntents = new Discord.Intents(Discord.Intents.ALL);
const client = new Discord.Client({ ws: { intents: myIntents } });

const prefix = '!';

const fs = require('fs');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord)
})


const token = 'ODg4MDYwNTAwODUwNjcxNjQ2.YUNMyg.ve4kDKjlxImI2fW0Y4AAT2cbL_g';



client.login(token);