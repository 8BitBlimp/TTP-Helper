const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cleardb')
		.setDescription('Clear Database (owner only)')
        .setDefaultMemberPermissions(0),
        
	async execute(interaction, db) {
        // enter command here
        
        await db.deleteAll()

        
        
	},
};