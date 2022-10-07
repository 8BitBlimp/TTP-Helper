const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Check your profile'),
	async execute(interaction, mongoeconomy) {
        // enter command here
        let person = interaction.user.id
        let memberData = await mongoeconomy.fetchMember(person, interaction.guild.id)
        interaction.reply(memberData)
	},
};