const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const mongoose = require('mongoose');
require('../../index.js')
const User = require('../../modules/user.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Check your profile')
		.addUserOption(option => option.setName('user').setDescription('Select the user you want to see the profile of.').setRequired(false)),
	async execute(interaction) {
        // enter command here

		let something = interaction.options.getUser('user')
		let userData = await User.findOne({ user: interaction.user.id })

		if(something) {
			userData = await User.findOne({ user: something.id })
			let profileEmbed = new EmbedBuilder()
				.setTitle(`${something.username}'s profile stats`)
				.setThumbnail(something.displayAvatarURL({ dynamic: true }))
				.setDescription(`Social Credit: ${userData.rep}
			Level: ${userData.level}
			XP: ${userData.xp}`)
			await interaction.reply({ embeds: [profileEmbed] })
		} else {
			let profileEmbed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s profile stats`)
				.setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
				.setDescription(`Social Credit: ${userData.rep}
			Level: ${userData.level}
			XP: ${userData.xp}`)
			await interaction.reply({ embeds: [profileEmbed] })
		}

		


	},
};