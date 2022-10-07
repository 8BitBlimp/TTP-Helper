const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('XP leaderboard'),
	async execute(interaction, mongoeconomy) {
        // enter command here
        let raw = await mongoeconomy.getLeaderBoard(interaction.guild.id, 10)
        let data = await mongoeconomy.convertLeaderBoard(interaction.client, raw)
        interaction.reply(data)
	},
};