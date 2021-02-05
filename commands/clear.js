const { MessageFlags } = require("discord.js")

module.exports={
    name: 'clear',
    description: "clear messages",
    async execute(message,args)
    {
        if(!args[1]) return message.reply("please enter the amount of messages that you want to clear...");
        if(isNaN(args[1])) return message.reply("please enter a real number...");
        if(args[1]>100) return message.reply("you can't delete more than 100 messages...");
        if(args[1]<1) return message.reply("you must delete atleast one message...");

        await message.channel.messages.fetch({ limit : args[1]}).then (messages =>{
            message.channel.bulkDelete(messages);
        });
    }
}