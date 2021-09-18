module.exports = {
    name: 'command',
    aliases: ['MaroCommands', 'help'],
    description: "Embeds",
    execute(client, message, args, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#304281')
        .setTitle('Commands')
        .setDescription('List of Commands')
        .addFields(
            {name: '#1', value: 'Maro'},
            {name: '#2', value: 'MaroPlay'},
            {name: '#3', value: 'MaroClear'}
        )

        message.channel.send(newEmbed);
    }

    
}