const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('Test commands!'),
        
	async execute(interaction) {
        // enter command here
        
        let something = await interaction.channel.messages.fetch();
        if (Array.isArray(something)) {
            interaction.reply(something[0])
        } else {
            interaction.reply(typeof(something))
        }
        
        
	},
};