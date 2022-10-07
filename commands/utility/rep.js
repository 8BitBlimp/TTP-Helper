const { SlashCommandBuilder } = require('@discordjs/builders');

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
	async execute(interaction, db) {
        // enter command here
        let pain = false
        let person = interaction.user.id
        let person2 = interaction.options.getUser('user')
        let newPerson = person2.id
        let choice = interaction.options.getString('rep-type')
        let fuck = await db.get(`${choice}_${person2}`)
        let choice2 = '-rep'
        if(choice == '-rep') fuck2 = '+rep'
        let fuck2 = await db.get(`${choice2}_${person2}`)
        
        console.log(fuck)
        if(fuck || fuck2){

            if(fuck){
                for(let i = 0; i < fuck.length; i++) {
                    if(fuck[i] == person) {
                        if(fuck2.has(person)){
                            await interaction.reply('changing rep.')
                            await db.delete
                        }
                        interaction.reply("You can't rep twice.")
                        pain = true
                        break
                    }
                }
            }
            
            if(fuck2) {
                for(let index = 0; index > fuck2.length; index++) {
                    if(fuck2 == person) {
                        interaction.reply("You can't rep twice.")
                        pain = true
                        break
                    }
                }
            }
        }
        
        if (pain == false){
            await db.push(`${choice}_${person2}`, `${person}`)
            await interaction.reply(`Gave ${interaction.user} +1 rep`)
        }
        
	},
};