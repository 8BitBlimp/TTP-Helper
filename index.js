const { Client, GatewayIntentBits, Collection, Permissions, EmbedBuilder } = require('discord.js')
const fs = require('node:fs')
const config = require('./config.json')

const wrong = ["me", "i", "mine"];
const right = ["us", "we", "our"];

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

bot.once('ready', () => {
    console.log(`Logged in as ${bot.user.username}`)
})

bot.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
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

            if(!newName == config.game && !oldName == config.game) return
            if(newPresence.user.bot) return
                    
            c.send(`User: ${newPresence.user.username}\nNew Presence: ${newName}\nOld Presence: ${oldName}`)

                
            
        }catch(error) {
            console.error(error)
            console.log(newPresence.user.username)
        };
    });
});

bot.login(process.env.TTP)