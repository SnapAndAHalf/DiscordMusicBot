module.exports = {
    name: 'MaroLeave',
    aliases: ['Leave', 'l'],
    description: 'Command For Leave',
    async execute(client, message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send("You need to be in the channel to stop the music");
        await voiceChannel.leave();
        await message.channel.send('Leaving channel :smiling_face_with_tear:');

    }
}