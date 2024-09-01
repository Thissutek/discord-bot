const { SlashCommandBuilder } = require('discord.js');
const { listTask } = require('../../taskManagement');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list-tasks')
        .setDescription('list all current tasks'),
    async execute(interaction) {
        const tasks = await listTask();
        if (tasks.length === 0) {
            await interaction.reply('Master, there are no tasks to do');
        } else {
            const taskList = tasks.map(task => {
                return `${task.name} - ${task.priority} - ${task.setDescription}`
            }).join('\n');

            await interaction.reply(`Task List: \n${taskList}`)
        }
    },
};