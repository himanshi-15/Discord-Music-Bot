const Discord= require('discord.js');
const bot=new Discord.Client();
const ytdl= require("ytdl-core");


const { Player } = require("discord-player");
const player = new Player(bot);
bot.player = player;

const fs=require('fs');
bot.commands=new Discord.Collection();
const commandfiles =  fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandfiles)
{
    const command=require(`./commands/${file}`);

    bot.commands.set(command.name,command);
}

var playing = false;


bot.login('your token name here');

bot.on("ready", () => {
    console.log('Music_bot is online!');
})


const servers={};
bot.on("message", async message => {
    const prefix='-';

    const args = message.content.substring(prefix.length).split(" ");
    // const command = args.shift().toLowerCase();

    if(args[0] === "hello")
    {
        message.channel.send("hi");
    }
    if(args[0]==="clear")
    {
        bot.commands.get('clear').execute(message,args);
    }
    if(args[0] === "play"){

        function play(connection,message)
        {
            playing=true;
            var server=servers[message.guild.id];
            server.dispacther= connection.play(ytdl(server.queue[0],{filter: "audioonly"}));
            server.queue.shift();
            server.dispacther.on("end",function(){
                if(server.queue[0])
                {
                    play(connection,message);
                }
                else{
                    connection.disconnect();
                    playing = false;
                }
            });
        }

        if(!args[1])
        {
            message.channel.send("you need to provide a link!");
        }
        if(!message.member.voice.channel)
        {
            message.channel.send("you must have to be in channel to play bot!:(");
        }
        if(!servers[message.guild.id]) servers[message.guild.id]= {
            queue: []
        }

        var server=servers[message.guild.id];

        server.queue.push(args[1]);
        if(!playing)
        {
            playing = true;
            if(!message.guild.voiceConnection) message.member.voice.channel.join().then(connection => {
                    play(connection,message);
            });
        }
    }
	if(args[0]=== "stop"){
        var server= servers[message.guild.id];
        
        server.dispacther.end();
        message.channel.send("stopped!");
        playing=false;
    }

})

