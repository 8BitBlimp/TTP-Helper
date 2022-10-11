const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('XP leaderboard'),
	async execute(interaction) {
        // enter command here

	},
};