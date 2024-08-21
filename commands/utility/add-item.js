const { SlashCommandBuilder } = require('discord.js');
const {addItem} = require('../../refrigeratorReminder')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('add-item')
    .setDescription('Add an item into your refrigerator')
    .addStringOption(option => 
        option.setName('name')
            .setDescription('Name of the food item')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('category')
            .setDescription('Food Group (Meat, Vegetables, Dairy, etc)')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('expiry')
            .setDescription('Number of days before expiry')
            .setRequired(true))
    .addStringOption(option => 
        option.setName('exact_expiry')
            .setDescription('Exact expiry date (YYYY-MM-DD)')
            .setRequired(false)),
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const category = interaction.options.getString('category');
        const expiryDuration = interaction.options.getString('expiry');
        const exactExpiryDate = interaction.options.getString('exact_expiry')

        const item = await addItem(name, category, expiryDuration, exactExpiryDate);

        await interaction.reply(`Added ${name} - ${category} to the refrigerator. Expires in ${expiryDuration} days. `)
    },
}