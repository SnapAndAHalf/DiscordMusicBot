const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports = {
    name: 'play',
    aliases: ['skip', 'stop'],
    description: 'Command for playing song',

    async execute(client, message, args, trash, cmd) {
                
        const voice_channel = message.member.voice.channel;
        if(!voice_channel) return message.channel.send('Maro Mujhe Warna Channel Join Karo');
        
        const server_queue = queue.get(message.guild.id);

        if(cmd === 'play'){
            
            if(!args.length) return message.channel.send('You need to send the argument');
            let song = {};

            if(ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0]);
                song = {title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}
            } else {
                const video_finder = async (query) => {
                    const videoResult = await ytSearch(query);
                    
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
                }

                const video = await video_finder(args.join(' '));
                if(video){
                    song = {title: video.title, url: video.url}
                } else {
                    message.channel.send('Error finding the video');
                }
            }
            if(!server_queue){
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
    
                queue.set(message.guild.id, queue_constructor);
                queue_constructor.songs.push(song);
    
                try{
                    const connection = await voice_channel.join();
                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0]);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connection!');
                    throw err;
                }
            } else {
                server_queue.songs.push(song);
                return message.channel.send(`:thumbsup: **${song.title}** added to queue!`);
            }
        } else if(cmd === 'skip') skip_song(message, server_queue);
        else if(cmd === 'stop') stop_song(message, server_queue);
    }
}

const video_player = async (guild, song) => {
    const song_queue = queue.get(guild.id);

    if(!song){
        song_queue.voice_channel.leave();
        queue.delete(guild.id);
        return;
    }
    const stream = ytdl(song.url, {filter: 'audioonly', quality: 'lowestaudio'});
    song_queue.connection.play(stream, {seek: 0, volume: 1})
    .on('finish', () => {
        song_queue.songs.shift();
        video_player(guild, song_queue.songs[0]);
    });
    await song_queue.text_channel.send(`Now Playing **${song.title}**`)

}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('Maro Mujhe Warna Channel Join Karo');
    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`);
    }
    server_queue.connection.dispatcher.end();
}

const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) return message.channel.send('Maro Mujhe Warna Channel Join Karo');
    server_queue.songs = [];
    server_queue.connection.dispatcher.end();
}