const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: 'MaroPlay',
    aliases: ['p', 'Play'],
    description: 'Command for playing song',
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('Maro Mujhe Warna Channel Join Karo');
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissions');
        if(!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissions');
        if(!args.length) return message.channel.send('Gaane Ka Naam Do Deh Brother');

        const validURL = (str) => {
            var regex = /(http|htpps):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)){
                return false;
            } else {
                return true;
            }
        }

        if(validURL(args[0])){
            const connection = await voiceChannel.join();
            const stream = ytdl(args[0], {filter: 'audioonly', quality: 'highest'});

            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
                message.channel.send('Leaving Channel');
            });

            await message.reply(`:thumbsup: Mar Ke Bajao ***Your Link!***`)
            return;
        }

        const connection = await voiceChannel.join();
        console.log('connection')
        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);
            console.log('videore'+videoResult)
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));
        console.log('video'+video)
        if(video){
            console.log(video.url);
            const stream = ytdl(video.url, {filter: 'audioonly', quality: 'highest'});
            connection.play(stream, {seek: 0, volume: 1})
            .on('finish', () => {
                voiceChannel.leave();
            });

            await message.reply(`:thumbsup: Mar Ke Bajao ***${video.title}***`)
        } else {
            message.channel.send('No video results found');
        }
    }
}