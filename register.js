const { REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('setbaachannel')
    .setDescription('Set the channel where Pink Sheep will BAA!')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  new SlashCommandBuilder()
    .setName('deletebaachannel')
    .setDescription('Remove the Pink Sheep BAA channel setting for this server')
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('📡 Registering slash commands globally...');

    await rest.put(
      Routes.applicationCommands(process.env.client_id),
      { body: commands }
    );

    console.log('✅ Successfully registered global slash commands.');
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
  }
})();
