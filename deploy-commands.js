const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, folders } = require('./config.json')

const commands = []

for(let i = 0; i < folders.length; i++) {
    // console.log(folders[i])
    let commandFiles = fs.readdirSync(`./commands/${folders[i]}`).filter(file => file.endsWith('.js'))
    let folder = folders[i]
    for (let file of commandFiles) {
        try{
            console.log(`file: ${file}, folder: ${folder}`)
            let command = require(`./commands/${folder}/${file}`)
            commands.push(command.data.toJSON())
        }catch(err){
            console.log(`${file} fucked up`)
            console.log(err)
        }

    }
}

console.log(commands)
const rest = new REST({ version: '9' }).setToken(process.env.TTP)

rest.put(Routes.applicationGuildCommands(clientId, guildId), {body: commands })
    .then(() => console.log(`Succesfully registered application commands.`))
    .catch(console.error);