const { SlashCommandBuilder } = require('@discordjs/builders');
const User = require('../../modules/user.js')
const { EmbedBuilder } = require('discord.js')
const mongoose = require('mongoose');
require('../../index.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleardb')
		.setDescription('Clear Database (owner only)')
        .setDefaultMemberPermissions(0),
        
	async execute(interaction) {
        // enter command here
        mongoose.connection.db.dropDatabase()
		interaction.reply(`Dropped User DB`)

        
        
	},
};