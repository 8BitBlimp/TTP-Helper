const { SlashCommandBuilder } = require('@discordjs/builders');
const mongoose = require('mongoose');

require('../../index.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test commands!'),
        
	async execute(interaction) {
        // enter command here
        await interaction.reply(`${mongoose.connection.readyState}`);
        
        
        
        
	},
};