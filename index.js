const { channel } = require('diagnostics_channel')
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
    // for(let i = 0; i < wrong.length; i++) {
    //     if(message.content.toLowerCase().indexOf(" "+wrong[i]+" ") != -1) {
    //         message.channel.send(`${message.content.toLowerCase().replace(" "+wrong[i].toLowerCase()+" ", " "+right[i])+" "}` + '*')
    //     }
    // }
    
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
        .setDescription(`Welcome to Tax The Poor (TTP)! You don't own your money, we own your money!`)
        .setColor('#FFFF00.')
    bot.guild.channels.fetch(config.joinChannel).then(c => {
        c.send(welcomeEmbed)
    })
})

bot.on('presenceUpdate', async (oldPresence, newPresence) => {


    let oldOBJ = Object.values(oldPresence.activities)
    let newOBJ = Object.values(newPresence.activities)
    let oldName = oldOBJ[0]
    let newName = newOBJ[0]

    const c = bot.channels.fetch(config.dChannel).then(c => {

    


        if(newName == config.game || oldName == config.game) {
            if(!newPresence.user.bot) {
                
                if(newName == undefined) {
                    let newName = "Nothing"
                    c.send("Old Activity: " + oldName + "\n" + "New Activity: " + newName + '\n' + "User: " + newPresence.user.username)
                } else if (oldName == undefined) {
                    let oldName = "Nothing"
                    c.send("Old Activity: " + oldName + "\n" + "New Activity: " + newName + '\n' + "User: " + newPresence.user.username)
                } else {
                    c.send("Old Activity: " + oldName + "\n" + "New Activity: " + newName + '\n' + "User: " + newPresence.user.username)
                }
            }
        }
    
    
    })

    
    // console.log(`${newPresence.user} changed presence from "${oldPresence}" to "${newPresence}"`)
})

bot.login(process.env.token)