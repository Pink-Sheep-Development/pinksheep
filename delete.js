const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🧹 Deleting all global commands...');

    const commands = await rest.get(
      Routes.applicationCommands(process.env.client_id)
    );

    for (const command of commands) {
      await rest.delete(
        Routes.applicationCommand(process.env.client_id, command.id)
      );
      console.log(`❌ Deleted command: ${command.name}`);
    }

    console.log('✅ All global commands deleted.');
  } catch (err) {
    console.error('Error deleting commands:', err);
  }
})();
