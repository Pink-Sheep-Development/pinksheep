const {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionsBitField
} = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

const configPath = path.join(__dirname, "baachannels.json");
let baaChannels = {};
if (fs.existsSync(configPath)) {
  baaChannels = JSON.parse(fs.readFileSync(configPath, "utf-8"));
}
function saveBaaChannels() {
  fs.writeFileSync(configPath, JSON.stringify(baaChannels, null, 2));
}

const baaaMessages = [
  "BAAAAAAAAAAA 🐑",
  "bAAAaaaAAAaaAaa",
  "✨🕱️AAAAAAAAA✨",
  "Baa moment™",
  "🚨BAA EMERGENCY🚨",
  "This is your daily baa. Carry on.",
];

const easterEggs = [
  "Pink Sheep is watching 👁️🐑",
  "Baa... but like, philosophically 🧠",
  "You've unlocked Ultra Instinct Baa 🐉",
  "This baa has been brought to you by Mustache Gang™️",
  "I'm not just a bot... I'm a baa-t.",
];

function scheduleBaaa() {
  const min = 10 * 60 * 1000;
  const max = 30 * 60 * 1000;
  const interval = Math.floor(Math.random() * (max - min + 1)) + min;

  setTimeout(async () => {
    for (const [guildId, guild] of client.guilds.cache) {
      try {
        const channelId = baaChannels[guild.id];
        if (!channelId) continue;

        const channel = guild.channels.cache.get(channelId);
        if (
          !channel ||
          !channel.isTextBased() ||
          !channel
            .permissionsFor(guild.members.me)
            .has(PermissionsBitField.Flags.SendMessages)
        )
          continue;

        const messages = await channel.messages.fetch({ limit: 1 });
        const lastMsg = messages.first();
        if (!lastMsg || Date.now() - lastMsg.createdTimestamp > 30 * 60 * 1000)
          continue;

        const msg =
          Math.random() < 0.01
            ? easterEggs[Math.floor(Math.random() * easterEggs.length)]
            : baaaMessages[Math.floor(Math.random() * baaaMessages.length)];

        channel.send(msg);
      } catch (err) {
        console.error(`Error in guild ${guildId}:`, err);
      }
    }

    scheduleBaaa();
  }, interval);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content.includes("pink")) {
    message.reply("Did someone say PINK?! 💅");
  } else if (content.includes("sheep")) {
    message.reply("You summoned the majestic baa lord 🐑");
  } else if (content.includes("who asked")) {
    message.reply("I asked. BAAAAAAAAA.");
  } else if (content === ".") {
    message.reply("...BAA.");
  }

  if (content === "!force" && message.author.id === "201654076369403904") {
    const egg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
    message.channel.send(`🧪 Dev Forced: ${egg}`);
  }

  if (Math.floor(Math.random() * 200) === 0) {
    message.channel.send(
      easterEggs[Math.floor(Math.random() * easterEggs.length)]
    );
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "setbaachannel") {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) {
      return interaction.reply({ content: 'You need **Manage Server** permission to use this command.', ephemeral: true });
    }

    baaChannels[interaction.guild.id] = interaction.channel.id;
    saveBaaChannels();

    return interaction.reply({
      content: `✅ Set <#${interaction.channel.id}> as the official BAA channel!`,
      ephemeral: true,
    });
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  scheduleBaaa();
});

client.login(process.env.TOKEN);
