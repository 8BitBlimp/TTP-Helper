const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bdelete')
		.setDescription('Bulk delete messages!')
        .addIntegerOption(option => option.setName(`int`).setDescription('Select a number between 2 and 100').setRequired(true)),
	async execute(interaction) {
        // enter command here
        let opt = interaction.options.getInteger('int')
        console.log(opt)
        if(opt <= 1 || opt >= 101) {
            await interaction.reply('You have to choose between 2 and 100')
        } else {
            await interaction.channel.bulkDelete(opt).then(() => {
                interaction.reply(`Deleted ${opt} messages.`);
            })
        }

        
	},
};