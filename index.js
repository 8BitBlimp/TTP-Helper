const { Client, GatewayIntentBits, Collection, Permissions, EmbedBuilder } = require('discord.js')
const fs = require('node:fs')
const config = require('./config.json')
const mongoose = require('mongoose');

const wrong = ["me", "i", "mine"];
const right = ["us", "we", "our"];

const User = require("./modules/user.js")

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences] })
bot.commands = new Collection()


for(let i = 0; i < config.folders.length; i++) {
    console.log(config.folders[i])
    let commandFiles = fs.readdirSync(`./commands/${config.folders[i]}`).filter(file => file.endsWith('.js'))
    let folder = config.folders[i]
    for(let file of commandFiles) {
        let command = require(`./commands/${config.folders[i]}/${file}`)
        bot.commands.set(command.data.name, command)
    }
}

let event = require('./modules/user.js')
// do a bot event for this
// https://github.com/Sitarkjs/discord-mongodb-level-bot/blob/main/stark.js


bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.username}`)
    mongoose.connect(`mongodb+srv://hollowhuu:4bAO4pUi4u1pya1t@discord-bot.5mmizai.mongodb.net/?retryWrites=true&w=majority`);

})
// password DELETE AFTER USE: 4bAO4pUi4u1pya1t
// mongodb+srv://hollowhuu:4bAO4pUi4u1pya1t@discord-bot.5mmizai.mongodb.net/test

bot.on('messageCreate', async message => {
    let person = message.author.id
    
    if(message.author.bot || message.channel.isDMBased()) return;
    
    addLevel(message)

    for(let i = 0; i < config.banned.length; i++) {
        if (message.content.toLowerCase().includes(`${config.banned[i]}`)) {
            message.delete()
            console.log('Silenced the democrat!')
            bot.channels.fetch(config.dChannel).then(c => {
                c.send(`${message.author} said "${config.banned[i]}", in the context of: \n "${message.content}"`)
            })
        }
        
    }

    
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName)

    if (!command) return;

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

bot.on('guildMemberAdd', async member => {
    let welcomeEmbed = new EmbedBuilder()
        .setTitle(`${member.user.tag} just joined!`)
        .setThumbnail(config.serverIcon)
        .setDescription(`Welcome to Tax The Poor (TTP)! It's not your money, it's our money!`)
        .setColor('#FFFF00.')
    bot.channels.fetch(config.joinChannel).then(c => {
        c.send({ embeds: [welcomeEmbed] })
    })
})

bot.on('presenceUpdate', async (oldPresence, newPresence) => {

    if(!newPresence.activities && !oldPresence.activities) return
    
    const c = bot.channels.fetch(config.dChannel).then(c => {
        

        try {
            let oldOBJ = Object.values(oldPresence.activities)
            let newOBJ = Object.values(newPresence.activities)
            let oldName = oldOBJ[0]
            let newName = newOBJ[0]
            
            if(newName == 'Custom Status') newName = newOBJ[1]
            if(oldName == 'Custom Status') oldName = oldOBJ[1]

            if(!newName == config.game && !oldName == config.game || (newName == undefined && oldName == undefined)) return
            if(newPresence.user.bot) return
            
            if(newName == config.game) c.send(`User ${newPresence.user.username} started playing ${newName}`)
            if(oldName == config.game) c.send(`User ${oldPresence.user.username} started playing ${oldName}`)


                
            
        }catch(error) {
            console.error(error)
            console.log(newPresence.user.username)
        };
    });
});

async function addLevel(message) {

    let levelData = await User.findOne({ user: message.author.id })

    if(!levelData) {
        let newLevel = new User({
            user: message.author.id
        }).save();
    } else {
        let addedXP = Math.floor(Math.random() * (5 - 1) + 1);
        levelData.xp += addedXP
        levelData.save().then(data => {
            if(data.xp >= data.xpToLevel) {
                levelData.xp = 0;
                levelData.level++;
                levelData.xpToLevel += data.level * 123;
                levelData.save().then(async _data => {
                    message.reply(`${message.author} is now level ${_data.level}`);
                })
            }
        })
    }
}

bot.login(process.env.TTP)