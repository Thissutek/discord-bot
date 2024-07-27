const { SlashCommandBuilder } = require('discord.js');
const { execute } = require('./reload');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Provides info about user or a server!')
        .addSubcommand(subcommand => 
            subcommand 
                .setName('user')
                .setDescription('Info about a user')
                .addUserOption(option => option.setName('target').setDescription('The user')))
        .addSubcommand(subcommand => 
            subcommand
                .setName('server')
                .setDescription('Info about the server')),
    async execute(interaction) {
        await interaction.reply(``)
    }
}