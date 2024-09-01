const { SlashCommandBuilder } = require('discord.js');
const { addTask } = require('../../taskManagement');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-task')
        .setDescription('add task to task to list')
        .addStringOption(option => 
            option.setName('name')
            .setDescription('Name of task')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('priority')
            .setDescription('priority of task')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('description')
            .setDescription('Description of task')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('due-date')
            .setDescription('Due date of task')
            .setRequired(false)),        
    async execute(interaction) {
        const name = interaction.options.getString('name');
        const priority = interaction.options.getString('priority');
        const description = interaction.options.getString('description');
        const dueDate = interaction.options.getString('due-date');
        
        const task = await addTask(name, priority, description, dueDate);

        await interaction.reply(`Added ${name} - ${priority}`)
    },
};