const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../../modules/user.js')
const { EmbedBuilder } = require('discord.js')
const mongoose = require('mongoose');
const ms = require('ms')
require('../../index.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rep')
		.setDescription('increase or remove rep from people!')
        .addUserOption(option => option.setName('user').setDescription('Select the user you want to rep').setRequired(true))
        .addStringOption(option =>
            option.setName('rep-type')
                .setDescription('Choose the type of rep.')
                .setRequired(true)
                .addChoices(
                    { name: '+rep', value: '+rep'},
                    { name: '-rep', value: '-rep'},
                )),
	async execute(interaction) {
        // enter command here
        let authorData = await User.findOne({ user: interaction.user.id })
        let userData = await User.findOne({ user: interaction.options.getUser('user').id })
        let choice = interaction.options.getString('rep-type')
        let cooldown = 86400000
        console.log('check 1')

        if(authorData.repCooldown !== 0){
            console.log('check 2')
            timeOBJ = ms(cooldown - (Date.now() - authorData.repCooldown));
            console.log(timeOBJ)
            await interaction.reply(`Test`)
        } else {
            console.log('check 3')
            if(choice == '+rep') {
                userData.rep++
                authorData.repCooldown = Date.now()
                console.log(authorData.repCooldown)
                userData.save().then(interaction.reply(`Gave ${interaction.options.getUser('user')} 1 social credit. They're now at ${userData.rep} social credit.`))
            }
            if(choice == '-rep') {
                userData.rep--
                authorData.repCooldown = Date.now()
                console.log(authorData.cooldown)
                userData.save().then(interaction.reply(`Removed 1 social credit from ${interaction.options.getUser('user')}. They're now at ${userData.rep} social credit.`))
            }
        }


        
	},
};