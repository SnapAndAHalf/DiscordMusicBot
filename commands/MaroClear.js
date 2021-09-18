module.exports = {
    name: 'MaroClear',
    aliases: ['Clear', 'clr', 'clear'],
    description: 'Clears Message',
    async execute(client, message, args){
        // if(!args[0]) return message.reply("Please enter the amount of messages you want to clear");
        // if(isNaN(args[0])) return message.reply("Please enter a real number");

        // if(args[0] > 100) return message.reply("You cannot delete more than 100 messages!");
        // if(args[0] < 1) return message.reply("You must delete atleast one message!");
    
        await message.channel.messages.fetch().then(messages => {
            message.channel.bulkDelete(messages);
        });
    }
}