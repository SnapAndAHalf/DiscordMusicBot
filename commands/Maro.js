module.exports = {
    name: 'Maro',
    description: 'This is a ping command!',
    execute(client, message, args){
        message.channel.send("Mujhe");
    }
}